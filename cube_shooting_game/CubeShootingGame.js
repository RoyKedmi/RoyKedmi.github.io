import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import { PointerLockControls } from './assets/js/lib/threejs/examples/jsm/controls/PointerLockControls.js'
import EnemyCube from './EnemyCube.js'
import Player from './Player.js'
import HUD from './HUD.js'
import MainMenu from './MainMenu.js'
import TextButton from './TextButton.js'
import EndlessLevel from './levels/EndlessLevel.js'
import ColorTypes from './ColorTypes.js'

export default class CubeShootingGame {
    static states = { mainMenu: 0, inGame: 1, inBetweenLevels: 2 };
    static state = CubeShootingGame.states.mainMenu;
    constructor() {
        this.screenMiddle = new THREE.Vector2(0, 0);
        this.lastTimestamp = 0;
        this.updateRate = 1 / 60;
        this.sumDeltaTime = this.updateRate;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.raycaster = new THREE.Raycaster();
        this.lastIntersection = null;

        document.body.appendChild(this.renderer.domElement);

        this.mouse = new THREE.Vector2(window.innerWidth, window.innerHeight);
        this.camera.position.z = 10;

        this.mainMenu = new MainMenu(this.scene, 
                                     () => this.onContinueClicked(),
                                     () => this.onNewRunClicked(),
                                     () => this.onExitClicked());

        this.controls = new PointerLockControls(this.camera, document.body);
        this.player = new Player(this.scene, this.camera, this.controls);

        this.currentLevel = new EndlessLevel(this.scene, this.player);

        if (CubeShootingGame.state == CubeShootingGame.states.mainMenu) {
            var teleportPosition = new THREE.Vector3().copy(this.mainMenu.getCenterPosition());
            this.player.teleport(teleportPosition);
        }

        this.HUD = new HUD(this.renderer, this.player);
        this.possibleColor = ColorTypes.allColorTypes;

        this.scene.background = new THREE.Color( 0x003070);
        this.scene.background = new THREE.Color( 0x000000);
        //this.scene.fog = new THREE.Fog( 0xffffff, 0, 60);

        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        light.position.set( 0, 0, -100);
        this.scene.add( light );

        this.isGamePaused = false;
        this.isExiting = false;
        this.exitTimer = 0;
        this.fallTimeExit = 3;

        document.addEventListener("mousemove", (e) => this.onMouseMove(e), false);
        document.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
        document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
        document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
        window.addEventListener("resize", () => this.onWindowResize(), false);
        document.addEventListener("click", () => this.onClick(), false);

        this.controls.addEventListener("lock", () => this.onControlLock());
        this.controls.addEventListener("unlock", () => this.onControlUnlock());

        navigator.keyboard.lock(["Escape"]);

        //this.onContinueClicked();
    }

    onContinueClicked() {
        this.player.teleport(this.currentLevel.getSpawnPoint());
        this.player.disableMovement();
        CubeShootingGame.state = CubeShootingGame.states.inGame;
    }

    onNewRunClicked() {
        this.player.teleport(this.currentLevel.getSpawnPoint());
        this.player.disableMovement();
        CubeShootingGame.state = CubeShootingGame.states.inGame;
    }

    onExitClicked() {
        this.mainMenu.removeFloor();
        this.isExiting = true;
        this.exitTimer = 0;
    }

    onControlLock() {
        this.isGamePaused = false;
    }

    onControlUnlock() {
        this.isGamePaused = true;
    }

    onClick() {
        this.controls.lock();
        document.documentElement.requestFullscreen();
    }

    onKeyDown(e) {
        if (!this.isGamePaused) {
            if (e.code == "KeyZ") {
                this.player.currentColor = this.possibleColor[0];
            }
            if (e.code == "KeyX") {
                this.player.currentColor = this.possibleColor[1];
            }
            if (e.code == "KeyC") {
                this.player.currentColor = this.possibleColor[2];
            }
            if (e.code == "Space") {
                this.player.jump();
            }
            if (e.code == "KeyW") {
                this.player.moveForward = true;
            }
            if (e.code == "KeyS") {
                this.player.moveBackwards = true;
            }
            if (e.code == "KeyD") {
                this.player.moveRight = true;
            }
            if (e.code == "KeyA") {
                this.player.moveLeft = true;
            }
            if (e.code == "Escape") {
                CubeShootingGame.state = CubeShootingGame.states.mainMenu;
                this.currentLevel.toMainMenu();
            }
        }
    }

    onKeyUp(e) {
        if (!this.isGamePaused) {
            if (e.code == "KeyW") {
                this.player.moveForward = false;
            }
            if (e.code == "KeyS") {
                this.player.moveBackwards = false;
            }
            if (e.code == "KeyD") {
                this.player.moveRight = false;
            }
            if (e.code == "KeyA") {
                this.player.moveLeft = false;
            }
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.HUD.resize();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(e) {
        if (this.lastIntersection) {
            if (this.lastIntersection.userData instanceof EnemyCube) {
                if (!this.lastIntersection.userData.isGoingToDie) {
                    if (this.player.currentColor == this.lastIntersection.userData.colorType) {
                        this.lastIntersection.userData.kill();
                        this.player.score += 1;
                    }
                }
            }

            if (this.lastIntersection.userData instanceof TextButton) {
                this.lastIntersection.userData.click();
            }
        }
    }

    onMouseMove(e) {
        e.preventDefault();

        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    }

    startGame() {
        this.lastTimestamp = 0;
        this.gameloop(this.lastTimestamp);
    }

    gameloop(timestamp) {
        var deltaTime = (timestamp - this.lastTimestamp) / 1000;

        //this.updateFixedInterval(deltaTime);
        if (!this.isGamePaused) {
            this.update(deltaTime);
        }
        this.lastTimestamp = timestamp;
    
        this.render();
        requestAnimationFrame((timestamp) => this.gameloop(timestamp));
    }

    render() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        this.HUD.render(this.isGamePaused);
    }

    update(deltaTime) {
        this.player.update(deltaTime);
        this.currentLevel.update(deltaTime);

        if (!this.isExiting) {
            if (this.player.getPosition().y < -500) {
                var teleportPosition = new THREE.Vector3().copy(this.mainMenu.getCenterPosition());
                teleportPosition.y += 500;
                this.player.teleport(teleportPosition);
            }
        } else {
            this.exitTimer += deltaTime;
            if (this.exitTimer > this.fallTimeExit) {
                location.reload(true);
            }
        }

        if (CubeShootingGame.state == CubeShootingGame.states.mainMenu) {
            if (this.mainMenu) {
                this.mainMenu.update(deltaTime);
            }
        }
        this.updateRaycast();
    }

    updateRaycast() {
        this.camera.updateMatrixWorld();
        this.raycaster.setFromCamera(this.screenMiddle, this.camera);
        //this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());

        var intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            var intersectedObj = intersects[0].object;
            if (this.lastIntersection != intersectedObj) {
                if (this.lastIntersection && this.lastIntersection.userData && this.lastIntersection.userData.unmark) {
                    this.lastIntersection.userData.unmark();
                    //this.lastIntersection.material.color.set(this.lastIntersection.originalColor);
                }

                this.lastIntersection = intersectedObj;

                if (this.lastIntersection && this.lastIntersection.userData && this.lastIntersection.userData.mark) {
                    this.lastIntersection.userData.mark();
                    //this.lastIntersection.material.color.set(this.lastIntersection.originalColor);
                }
                //this.lastIntersection.originalColor = this.lastIntersection.material.color.getHex();
                //this.lastIntersection.material.color.set(0xff0000);
            }
        } else {
            if (this.lastIntersection && this.lastIntersection.userData && this.lastIntersection.userData.unmark) {
                this.lastIntersection.userData.unmark();
                //this.lastIntersection.material.color.set(this.lastIntersection.originalColor);
            }

            this.lastIntersection = null;
        }
    }

    updateFixedInterval(deltaTime) {
        this.sumDeltaTime += deltaTime;
        while (this.sumDeltaTime >= this.updateRate) {
            this.sumDeltaTime -= this.updateRate;
            this.update();
        }
    }
}
