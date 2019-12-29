import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import Utils from './Utils.js'
import ColorTypes from './ColorTypes.js'

export default class EnemyCube {
    constructor(scene, colorType, position) {
        this.scene = scene;
        this.colorType = colorType;

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.cube = new THREE.Mesh(geometry, this.material);

        this.cube.userData = this;

        this.cube.position.copy(position);
        this.respawn();
    }

    respawn() {
        //var cubeWorldPosition = new THREE.Vector3();
        //this.cube.getWorldPosition(cubeWorldPosition);

        //this.originalPosition = {x: cubeWorldPosition.x, 
        //                         y: cubeWorldPosition.y,
        //                         z: cubeWorldPosition.z};

        this.isDead = false;
        this.deltaTime = 0;
        this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.material.color.set(ColorTypes.getColorValueFromType(this.colorType));
        this.cube.material = this.material;
        this.isGoingToDie = false;
        this.goingToDieCountDown = 0;
        this.timeToDeath = 300;

        this.scene.add(this.cube);
    }

    kill() {
        if (!this.isGoingToDie) {
            this.isGoingToDie = true;
            var originalColor = new THREE.Vector3(this.material.color.r, this.material.color.g, this.material.color.b);
            //var squareNumber = Utils.getRandomIntBetween(2, 20);
            var squareNumber = 10;
            this.material = Utils.createBurnShaderMaterial(originalColor, squareNumber);
            this.cube.material = this.material;
            this.goingToDieCountDown = this.timeToDeath;
        }
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

        //Old movement forward
        //if (!this.isGoingToDie) {
        //    var t = this.deltaTime / this.timeToReachPlayer;
        //    this.cube.position.lerpVectors(this.originalPosition, this.player.getPosition(), t);
        //}

        //Old random rotation
        //Utils.addRotation(this.cube.rotation, this.rotationFactors);

        //if (t > 1.20) {
        //    if (!this.isGoingToDie) {
        //        //if (this.player.getPosition().z < this.cube.position.z) {
        //        //    this.kill();
        //        //    this.scene.remove(this.cube);
        //        //}
        //    }
        //}
    }
}
