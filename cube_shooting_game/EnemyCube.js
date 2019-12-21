import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import Utils from './Utils.js'

export default class EnemyCube {
    constructor(scene, spawner, player) {
        this.scene = scene;
        this.player = player;
        this.spawner = spawner;
        this.possibleColor = [0xff0000, 0x00ff00, 0x0000ff];

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.cube = new THREE.Mesh(geometry, this.material);

        this.cube.userData = this;
        this.respawn();
    }

    respawn() {
        this.cube.position.x = Utils.getRandomIntBetween(-20, 20);
        this.cube.position.y = Utils.getRandomIntBetween(-10, 10);
        this.cube.position.z = Utils.getRandomIntBetween(-50, -30);

        this.rotationFactors = {x: Utils.getRandomFloatBetween(-0.05, 0.05),
                                y: Utils.getRandomFloatBetween(-0.05, 0.05),
                                z: Utils.getRandomFloatBetween(-0.05, 0.05)};

        this.spawner.add(this.cube);
        //this.timeToReachPlayer = Utils.getRandomIntBetween(10, 20);
        this.timeToReachPlayer = Utils.getRandomIntBetween(3, 8);
        var cubeWorldPosition = new THREE.Vector3();
        this.cube.getWorldPosition(cubeWorldPosition);
        this.originalPosition = {x: cubeWorldPosition.x, 
                                 y: cubeWorldPosition.y,
                                 z: cubeWorldPosition.z};
        this.speed = Utils.getRandomFloatBetween(0.01, 0.05);
        this.isDead = false;
        this.deltaTime = 0;
        this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.material.color.set(this.possibleColor[Math.floor(Math.random()*this.possibleColor.length)]);
        this.cube.material = this.material;
        this.isGoingToDie = false;
        this.goingToDieCountDown = 0;
        this.timeToDeath = 300;

        this.spawner.remove(this.cube);

        this.addToScene();

    }

    kill() {
        if (!this.isGoingToDie) {
            this.isGoingToDie = true;
            //console.log("Killed");
            var originalColor = new THREE.Vector3(this.material.color.r, this.material.color.g, this.material.color.b);
            //var squareNumber = Utils.getRandomIntBetween(2, 20);
            var squareNumber = 10;
            this.material = Utils.createBurnShaderMaterial(originalColor, squareNumber);
            this.cube.material = this.material;
            this.goingToDieCountDown = this.timeToDeath;
        }
    }

    addToScene() {
        this.scene.add(this.cube);
    }

    update(deltaTime) {
        this.deltaTime += deltaTime;

        if (this.isGoingToDie) {
            this.goingToDieCountDown -= deltaTime*1000;
            this.material.uniforms.dissolve.value = this.goingToDieCountDown/this.timeToDeath;
            //console.log(this.material.uniforms["dissolve"]);
            if (this.goingToDieCountDown <= 0.0) {
                this.isDead = true;
            }
        }

        if (!this.isGoingToDie) {
            var t = this.deltaTime / this.timeToReachPlayer;
            this.cube.position.lerpVectors(this.originalPosition, this.player.getPosition(), t);
        }

        Utils.addRotation(this.cube.rotation, this.rotationFactors);

        if (t > 1.20) {
            if (!this.isGoingToDie) {
                if (this.player.getPosition().z < this.cube.position.z) {
                    this.kill();
                    this.scene.remove(this.cube);
                }
            }
        }
    }
}
