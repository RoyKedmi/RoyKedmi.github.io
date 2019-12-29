import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import EnemyCube from './EnemyCube.js'
import CubeShootingGame from './CubeShootingGame.js'
import InstructionsAI from './enemyAI/InstructionsAI.js'

export default class SpawnerPlate {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.meshesGroup = new THREE.Group();
        this.scene.add(this.meshesGroup);

        this.floorSize = 10;
        var floorGeometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000});
        //draw from both sides of the plane
        material.side = THREE.DoubleSide;
        this.floorMesh = new THREE.Mesh(floorGeometry, material);
        this.floorMesh.rotateX( -90*Math.PI / 180 );
        this.floorMesh.userData = this;
        //this.floorMesh.position.y = -10;
        this.meshesGroup.add(this.floorMesh);

        //this.meshesGroup.rotateY(45*Math.PI/180);
        this.isActivated = false;
        this.numberOfEnemies = 8;
        this.gameObjects = [];

        this.instructionsAI = new InstructionsAI(this.meshesGroup);
        this.instructionsAI.setPosition(new Vector3(0, 0, -30));
    }

    setPosition(position) {
        this.meshesGroup.position.copy(position);
    }

    activate() {
        if (!this.isActivated) {
            this.isActivated = true;
            this.player.disableMovement();

            //for (let i = 0; i < this.numberOfEnemies; i++) {
            //    var enemyCube = new EnemyCube(this.scene, this.meshesGroup, this.player);
            //    this.gameObjects.push(enemyCube);
            //}

            CubeShootingGame.state = CubeShootingGame.states.inGame;
        }
    }

    deactivate() {
    }

    update(deltaTime) {
        //Respawn dead cubes
        this.gameObjects.forEach((gameObject) => {
            gameObject.update(deltaTime);
            if (gameObject instanceof EnemyCube) {
                if (gameObject.isDead) {
                    gameObject.respawn();
                }
            }
        });
    }
}
