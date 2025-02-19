import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import Utils from './Utils.js'

export default class TextButton {
    constructor(parentMesh, font, text, onClick, size) {
        this.parentMesh = parentMesh;
        this.font = font;
        this.text = text;
        this.onClick = onClick;
        this.isClickable = true;
        this.size = size;

        var geometry = new THREE.TextGeometry(this.text, {
            font: this.font,
            size: this.size,
            height: 0.11,
            curveSegments: 20,
            bevelEnabled: false,
        });

        geometry.computeBoundingBox();
        var translationVector = geometry.boundingBox.max.sub(geometry.boundingBox.min).divideScalar(-2);
        geometry.translate(translationVector.x, translationVector.y, translationVector.z);
        this.material = new THREE.MeshBasicMaterial({color: 0x300030});
        this.buttonMesh = new THREE.Mesh(geometry, this.material);
        this.buttonMesh.position.z = -1 * this.floorSize / 2;

        this.buttonMesh.userData = this;
        this.parentMesh.add(this.buttonMesh);

        this.rotation = {x: Utils.getRandomFloatBetween(-0.01, 0.01),
                         y: Utils.getRandomFloatBetween(-0.01, 0.01),
                         z: Utils.getRandomFloatBetween(-0.01, 0.01)};
        this.updateCounter = 0;
        this.sumDeltas = 0;
    }

    update(deltaTime) {
        var factor = Math.sin(this.sumDeltas*5);
        this.sumDeltas += deltaTime;
        this.buttonMesh.rotateX(this.rotation.x*factor);
        this.buttonMesh.rotateY(this.rotation.y*factor);
        //this.buttonMesh.rotateZ(this.rotation.z*factor);
    }

    click() {
        if (this.isClickable) {
            this.onClick();
        }
    }

    setIsClickable(isClickable) {
        this.isClickable = isClickable;
    }

    mark() {
        if (this.isClickable) {
            this.originalColor = this.material.color.getHex();
            this.material.color.set(0xff0000);
        }
    }

    unmark() {
        if (this.isClickable) {
            this.material.color.set(this.originalColor);
        }
    }

    setMaterial(material) {
        this.buttonMesh.material = material;
    }
}
