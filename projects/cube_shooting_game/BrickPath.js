import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import { GLTFLoader } from './assets/js/lib/threejs/examples/jsm/loaders/GLTFLoader.js';
import Utils from './Utils.js'

export default class BrickPath {
    constructor(scene, width, height) {
        this.scene = scene;
        this.width = width;
        this.height = height;

        //create parent center of main menu room
        this.meshesGroup = new THREE.Group();
        this.scene.add(this.meshesGroup);
        
        var floorGeometry = new THREE.PlaneGeometry(this.width, this.height);
        this.material = Utils.createBrickPathMaterial();
        this.material.side = THREE.DoubleSide;
        this.material.uniforms.plane_size.value.x = this.width;
        this.material.uniforms.plane_size.value.y = this.height;

        this.floorMesh = new THREE.Mesh(floorGeometry, this.material);
        this.floorMesh.rotateX( -90*Math.PI / 180 );

        floorGeometry.computeBoundingBox();
        var translationVector = floorGeometry.boundingBox.max.sub(floorGeometry.boundingBox.min).divideScalar(2);
        floorGeometry.translate(0, translationVector.y, 0);

        this.floorMesh.userData = this;
        this.meshesGroup.add(this.floorMesh);

        //this.gltfLoader = new GLTFLoader(); 
        //this.gltfLoader.load("./assets/models/brick.gltf", 
        //                     (gltfModel) => this.onFinishedLoadingModel(gltfModel));

        this.playerPosition = new THREE.Vector2();
        this.sumTime = 0;
    }

    onFinishedLoadingModel(gltfModel) {
        //this.brickModel = gltfModel.scene.children[0];
        //var brickGeometry = this.brickModel.geometry;

        //brickGeometry.computeBoundingBox();

        //var modelSize = brickGeometry.boundingBox.max.sub(brickGeometry.boundingBox.min);
        //console.log(modelSize);
        //this.bricksMeshes = [];

        //var material = new THREE.MeshBasicMaterial({color: 0x500000});
        //material.side = THREE.DoubleSide;

        //var brickMesh = new THREE.Mesh(brickGeometry, material);
        //console.log(brickMesh);
        //console.log(this.brickModel);
        //this.meshesGroup.add(this.brickModel);
    }

    setPosition(position) {
        this.meshesGroup.position.copy(position);
    }

    update(deltaTime) {
        this.sumTime += deltaTime;
        this.material.uniforms.time.value = this.sumTime;
        this.playerPosition.y -= 0.2*deltaTime;
        if (this.playerPosition.y < 0) {
            this.playerPosition.y = 0;
        }
        this.material.uniforms.player_position.value = this.playerPosition.y;
    }

    setPlayerPosition(uv) {
        if (uv.y < this.playerPosition.y) {
            return;
        }
        this.playerPosition.copy(uv);
        this.material.uniforms.player_position.value = this.playerPosition.y;
    }
}
