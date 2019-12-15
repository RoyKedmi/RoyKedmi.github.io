import * as THREE from './three.module.js'
import Utils from './Utils.js'

export default class EnemyCube {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.possibleColor = [0xff0000, 0x00ff00, 0x0000ff];

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.cube = new THREE.Mesh(geometry, this.material);

        this.cube.userData = this;
        this.respawn();
    }

    respawn() {
        this.cube.position.x = Utils.getRandomIntBetween(-50, 50);
        this.cube.position.y = Utils.getRandomIntBetween(-20, 20);
        this.cube.position.z = Utils.getRandomIntBetween(-50, -30);

        this.rotationFactors = {x: Utils.getRandomFloatBetween(-0.01, 0.01),
                                y: Utils.getRandomFloatBetween(-0.01, 0.01),
                                z: Utils.getRandomFloatBetween(-0.01, 0.01)};

        this.timeToReachPlayer = Utils.getRandomIntBetween(10, 20);
        this.originalPosition = {x: this.cube.position.x, 
                                 y: this.cube.position.y,
                                 z: this.cube.position.z};
        this.speed = Utils.getRandomFloatBetween(0.01, 0.05);
        this.isDead = false;
        this.deltaTime = 0;
        this.material.color.set(this.possibleColor[Math.floor(Math.random()*this.possibleColor.length)]);

        this.addToScene();
    }

    addToScene() {
        this.scene.add(this.cube);
    }

    update(deltaTime) {
        this.deltaTime += deltaTime;

        var t = this.deltaTime / this.timeToReachPlayer;
        this.cube.position.lerpVectors(this.originalPosition, this.player.getPosition(), t);

        Utils.addRotation(this.cube.rotation, this.rotationFactors);

        if (t > 1.00 || this.player.getPosition().z < this.cube.position.z) {
            this.isDead = true;
            this.scene.remove(this.cube);
        }
    }
}
