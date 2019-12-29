import * as THREE from '../assets/js/lib/threejs/build/three.module.js'
import InstructionsAI from '../enemyAI/InstructionsAI.js'

export default class EndlessLevel {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.meshesGroup = new THREE.Group();
        this.scene.add(this.meshesGroup);

        this.floorSize = 5;
        var floorGeometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize);
        var material = new THREE.MeshBasicMaterial({color: 0xa0a0a0});
        //draw from both sides of the plane
        material.side = THREE.DoubleSide;
        this.floorMesh = new THREE.Mesh(floorGeometry, material);
        this.floorMesh.rotateX( -90*Math.PI / 180 );
        //this.floorMesh.position.y = -10;
        this.meshesGroup.add(this.floorMesh);

        this.spawnPoint = new THREE.Vector3();
        this.spawnPoint.copy(this.meshesGroup.position);
        this.spawnPoint.y += 10;

        this.isStopped = false;
        this.isRemoveFloor = false;
        this.removeFloorTimer = 0;

        this.instructionsAI = new InstructionsAI(this.meshesGroup);
        this.instructionsAI.setPosition(new THREE.Vector3(0, 10, -10));

        this.currentAIs = [this.instructionsAI];
    }

    getSpawnPoint() {
        return this.spawnPoint;
    }

    update(deltaTime) {
        this.currentAIs.forEach((ai) => {
            ai.update(deltaTime);
        });
        if (this.isStopped) {
        }

        if (this.isRemoveFloor) {
            this.meshesGroup.remove(this.floorMesh);
        }

        this.removeFloorTimer += deltaTime;
        if (this.removeFloorTimer > 0.3) {
            this.isRemoveFloor = false;
            this.removeFloorTimer = 0;
            this.meshesGroup.add(this.floorMesh);
        }
    }

    toMainMenu() {
        this.isStopped = true;
        this.isRemoveFloor = true;
        this.removeFloorTimer = 0;
        this.player.enableMovement();
    }
}
