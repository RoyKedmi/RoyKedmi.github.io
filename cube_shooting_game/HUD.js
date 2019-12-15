import * as THREE from './three.module.js'

export default class HUD {
    constructor(renderer, player) {
        this.renderer = renderer;
        this.player = player;
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        var width = this.canvas.width;
        var height = this.canvas.height;
        this.camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30);
        this.scene = new THREE.Scene();
        this.texture = new THREE.Texture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.needsUpdate = true;

        this.material = new THREE.MeshBasicMaterial( {map: this.texture });
        this.material.transparent = true;
        this.planeGeometry = new THREE.PlaneGeometry(width, height);
        this.plane = new THREE.Mesh(this.planeGeometry, this.material);
        this.scene.add(this.plane);

    }

    update() {
    }

    render() {
        this.clearCanvas();
        this.renderComponents();
        this.texture.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

    clearCanvas() {
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderComponents() {
        var ctx = this.canvas.getContext("2d");
        var textSize = 40;

        ctx.font = "Normal " + textSize + "px dpcomic";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
        ctx.fillText("Health: " + this.player.health, 2, textSize);

        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
        ctx.fillText("Score: " + this.player.score, this.canvas.width - 2, textSize);

        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
        ctx.fillText("Color: ", this.canvas.width / 2, textSize);

        var colorHex = "#" + this.player.currentColor.toString(16).padStart(6, "0");
        ctx.fillStyle = colorHex;
        ctx.fillRect(this.canvas.width / 2 + 40, 4, 100, 40);

        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
        ctx.fillText("Click on the cubes with the right color", this.canvas.width / 2 - 2, textSize * 2);
        ctx.fillText("Press q, w or e to change color", this.canvas.width / 2 - 2, textSize * 3);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        //ctx.fillText("Initalizing...", 0, this.canvas.height / 2);

        var width = this.canvas.width;
        var height = this.canvas.height;
        this.camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30);

        if (this.plane) {
            this.scene.remove(this.plane);
            this.plane = null;
        }
        if (this.material) {
            this.material.dispose();
            this.material = null;
        }
        if (this.texture) {
            this.texture.dispose();
            this.texture = null;
        }
        if (this.planeGeometry) {
            this.planeGeometry.dispose();
            this.planeGeometry = null;
        }

        this.texture = new THREE.Texture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.needsUpdate = true;
        this.material = new THREE.MeshBasicMaterial( {map: this.texture });
        this.material.transparent = true;
        this.planeGeometry = new THREE.PlaneGeometry(width, height);
        this.plane = new THREE.Mesh(this.planeGeometry, this.material);
        this.scene.add(this.plane);
    }
}
