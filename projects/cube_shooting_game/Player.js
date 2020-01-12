import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import EnemyCube from './EnemyCube.js'
import Utils from './Utils.js'
import SpawnerPlate from './SpawnerPlate.js'
import BrickPath from './BrickPath.js'
import ColorTypes from './ColorTypes.js'

export default class Player {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        this.health = 100;
        this.raycastDirection = new THREE.Vector3(0, 0, -1);
        this.raycastNear = 0;
        this.raycastFar = 1;
        this.enemyCollisionRaycaster = new THREE.Raycaster(this.camera.position, 
                                             this.raycastDirection, 
                                             this.raycastNear,
                                             this.raycastFar);

        this.movementRaycaster = new THREE.Raycaster();

        this.score = 0;
        this.currentColor = ColorTypes.red;

        this.isCameraShaking = false;
        this.cameraShakeDelta = 0;
        this.cameraShakeTime = 0.2;
        this.cameraShakeDirection = new THREE.Vector3(1.0, 2.0, 3.0);
        this.cameraPostionDiff = new THREE.Vector3(0.0, 0.0, 0.0);

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.gravity = 9.8;
        this.mass = 1.0;

        this.canJump = false;
        this.jumpSpeed = 2.5*this.mass;
        this.moveBackwards = false;
        this.moveForward = false;
        this.moveRight = false;
        this.moveLeft = false;
        this.movementSpeed = 6;
        this.speedDampingFactor = 10.0;

        this.isCanMove = true;
    }

    addToScene() {
        this.scene.add(this.cube);
    }

    update(deltaTime) {
        this.updateMovement(deltaTime);

        if (this.isCameraShaking) {
            var factor = Math.cos(this.cameraShakeDelta*Math.PI*4)*1.0;

            this.cameraPostionDiff.addScaledVector(this.cameraShakeDirection, factor);
            this.camera.position.addScaledVector(this.cameraShakeDirection, factor);

            this.cameraShakeDelta += deltaTime*(1.0/this.cameraShakeTime);

            if (this.cameraShakeDelta >= 1.0) {
                this.isCameraShaking = false;
                this.cameraShakeDelta = 0;

                this.camera.position.addScaledVector(this.cameraPostionDiff, -1);
                this.cameraPostionDiff = new THREE.Vector3(0.0, 0.0, 0.0);
            }
        }

        var intersects = this.enemyCollisionRaycaster.intersectObjects(this.scene.children, true);
        //Check for collisions
        intersects.forEach((intersection) => {
            if (intersection.object.userData && intersection.object.userData instanceof EnemyCube) {
                var enemyCube = intersection.object;
                this.scene.remove(enemyCube);
                if (!enemyCube.userData.isGoingToDie) {
                    this.hit();
                }
                enemyCube.userData.kill();
            }
        });
    }

    updateMovement(deltaTime) {
        this.velocity.x -= this.velocity.x * this.speedDampingFactor * deltaTime;
        this.velocity.z -= this.velocity.z * this.speedDampingFactor * deltaTime;
        this.velocity.y -= this.gravity * this.mass * deltaTime;

        this.movementRaycaster.ray.origin.copy(this.controls.getObject().position);
        //this.movementRaycaster.ray.origin.y -= 8;
        this.movementRaycaster.ray.direction = new THREE.Vector3(0.0, -1.0, 0.0);
        var rayHeight = 8.0;
        this.movementRaycaster.far = rayHeight;
        
        var isNearIntersectFound = false;
        var intersects = this.movementRaycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            isNearIntersectFound = true;
            //Stop from falling, but keep jumping if needed
            //this.controls.getObject().position.y += rayHeight - intersects[0].distance;
            this.velocity.y = Math.max(0, this.velocity.y);
            if (this.velocity.y == 0) {
                this.canJump = true;
            }
        }

        intersects.forEach((intersect) => {
            if (intersect.object.userData instanceof SpawnerPlate) {
                intersect.object.userData.activate();
            }

            if (intersect.object.userData instanceof BrickPath) {
                intersect.object.userData.setPlayerPosition(intersect.uv);
            }
        });

        if (!isNearIntersectFound) {
            var currentPositionY = this.controls.getObject().position.y;
            var nextPositionY = currentPositionY + this.velocity.y;
            if (nextPositionY < currentPositionY) {
                var rayDistance = Math.abs(nextPositionY - currentPositionY);
                this.movementRaycaster.far = rayDistance;
                //console.log(this.movementRaycaster.far);
                var intersects = this.movementRaycaster.intersectObjects(this.scene.children, true);
                if (intersects.length > 0) {
                    //console.log("Here");
                    this.controls.getObject().position.y -= intersects[0].distance - rayHeight;
                    this.velocity.y = Math.max(0, this.velocity.y);
                    if (this.velocity.y == 0) {
                        this.canJump = true;
                    }
                }
            }
        }

        this.direction.z = Number(this.moveForward) - Number(this.moveBackwards);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.isCanMove) {
            if (this.moveForward || this.moveBackwards) {
                this.velocity.z -= this.direction.z * this.movementSpeed * deltaTime;
            }

            if (this.moveLeft || this.moveRight) {
                this.velocity.x -= this.direction.x * this.movementSpeed * deltaTime;
            }

            this.controls.moveRight(-this.velocity.x);
            this.controls.moveForward(-this.velocity.z);

        }
        this.controls.getObject().position.y += this.velocity.y;
    }

    jump() {
        if (this.canJump && this.isCanMove) {
            this.canJump = false;
            this.velocity.y += this.jumpSpeed;
        }
    }

    hit() {
        this.health -= 1;

        this.shakeCamera();
    }

    shakeCamera() {
        if (!this.isCameraShaking) {
            this.isCameraShaking = true;
            this.cameraShakeDirection = new THREE.Vector3(Utils.getRandomFloatBetween(-2, 2.0),
                                                          Utils.getRandomFloatBetween(-2, 2.0),
                                                          Utils.getRandomFloatBetween(-3, 3.0));
        }
    }

    getPosition() {
        return this.controls.getObject().position;
    }

    teleport(newPosition) {
        this.setPosition(newPosition);
    }

    setPosition(newPosition) {
        this.controls.getObject().position.copy(newPosition);
    }

    disableMovement() {
        this.isCanMove = false;
    }

    enableMovement() {
        this.isCanMove = true;
    }
}
