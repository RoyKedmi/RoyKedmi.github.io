import * as THREE from '../assets/js/lib/threejs/build/three.module.js'
import SpawnerPlate from '../SpawnerPlate.js'

export default class StoryLevel1 {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

        this.meshesGroup = new THREE.Group();
        this.scene.add(this.meshesGroup);

        //this.meshesGroup.position.x = 800;
        //this.meshesGroup.position.y = 1000;
        //this.meshesGroup.position.z = 1000;

        this.floorSize = 10;
        var floorGeometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize*10);
        var material = new THREE.MeshBasicMaterial({color: 0xa0a0a0});
        //draw from both sides of the plane
        material.side = THREE.DoubleSide;
        this.floorMesh = new THREE.Mesh(floorGeometry, material);
        this.floorMesh.rotateX( -90*Math.PI / 180 );
        //this.floorMesh.position.y = -10;
        this.meshesGroup.add(this.floorMesh);

        this.spawnerPlate = new SpawnerPlate(this.meshesGroup, this.player);
        var spawnerPosition = new THREE.Vector3();
        spawnerPosition.copy(this.meshesGroup.position);
        spawnerPosition.z -= this.floorSize*10 / 2;
        spawnerPosition.y += 3;
        this.spawnerPlate.setPosition(spawnerPosition);
    }

    getSpawnPoint() {
        var spawnPoint = new THREE.Vector3();
        spawnPoint.copy(this.meshesGroup.position);
        spawnPoint.y += 10;
        return spawnPoint;
    }

    update(deltaTime) {
        this.spawnerPlate.update(deltaTime);
    }
}
