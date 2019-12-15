import * as THREE from './three.module.js'
import EnemyCube from './EnemyCube.js'
import Utils from './Utils.js'

export default class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.health = 100;
        this.raycastDirection = new THREE.Vector3(0, 0, -1);
        this.raycastNear = 0;
        this.raycastFar = 1;
        this.raycaster = new THREE.Raycaster(this.camera.position, 
                                             this.raycastDirection, 
                                             this.raycastNear,
                                             this.raycastFar);
        this.score = 0;
        this.currentColor = 0xff0000;
    }

    addToScene() {
        this.scene.add(this.cube);
    }

    update() {
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        intersects.forEach((intersection) => {
            if (intersection.object.userData && intersection.object.userData instanceof EnemyCube) {
                var enemyCube = intersection.object;
                this.scene.remove(enemyCube);
                enemyCube.userData.isDead = true;
                this.health -= 1;
            }
        });
    }

    getPosition() {
        return this.camera.position;
    }
}
