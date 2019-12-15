import * as THREE from './three.module.js'
import EnemyCube from './EnemyCube.js'
import Player from './Player.js'
import HUD from './HUD.js'

export default class CubeShootingGame {
    constructor() {
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

        this.player = new Player(this.scene, this.camera);

        this.gameObjects = [];
        this.numberOfEnemies = 20;
        for (let i = 0; i < this.numberOfEnemies; i++) {
            var enemyCube = new EnemyCube(this.scene, this.player);
            this.gameObjects.push(enemyCube);
        }

        this.HUD = new HUD(this.renderer, this.player);
        this.possibleColor = [0xff0000, 0x00ff00, 0x0000ff];

        document.addEventListener("mousemove", (e) => this.onMouseMove(e), false);
        document.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
        document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }
    onKeyDown(e) {
        if (e.code == "KeyQ") {
            this.player.currentColor = this.possibleColor[0];
        }
        if (e.code == "KeyW") {
            this.player.currentColor = this.possibleColor[1];
        }
        if (e.code == "KeyE") {
            this.player.currentColor = this.possibleColor[2];
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
                if (this.player.currentColor == this.lastIntersection.material.color.getHex()) {
                    this.lastIntersection.userData.isDead = true;
                    this.player.score += 1;
                }
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
        this.update(deltaTime);
        this.lastTimestamp = timestamp;
    
        this.render();
        requestAnimationFrame((timestamp) => this.gameloop(timestamp));
    }

    render() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        this.HUD.render();
    }

    update(deltaTime) {
        this.player.update();

        this.gameObjects.forEach((gameObject) => {
            gameObject.update(deltaTime);
            if (gameObject instanceof EnemyCube) {
                if (gameObject.isDead) {
                    gameObject.respawn();
                }
            }
        });

        this.camera.updateMatrixWorld();
        this.raycaster.setFromCamera(this.mouse, this.camera);

        var intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            var intersectedObj = intersects[0].object;
            if (this.lastIntersection != intersectedObj) {
                if (this.lastIntersection) {
                    //this.lastIntersection.material.color.set(this.lastIntersection.originalColor);
                }

                this.lastIntersection = intersectedObj;
                //this.lastIntersection.originalColor = this.lastIntersection.material.color.getHex();
                //this.lastIntersection.material.color.set(0xff0000);
            }
        } else {
            if (this.lastIntersection) {
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
