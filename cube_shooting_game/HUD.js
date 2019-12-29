import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import CubeShootingGame from './CubeShootingGame.js'
import ColorTypes from './ColorTypes.js'

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

    render(isGamePaused) {
        this.clearCanvas();
        this.renderComponents(isGamePaused);
        this.texture.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

    clearCanvas() {
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderComponents(isGamePaused) {
        var ctx = this.canvas.getContext("2d");
        var textSize = 40;

        if (isGamePaused) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.font = "Normal " + textSize + "px dpcomic";
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
            ctx.fillText("Game is paused, press any key to continue", this.canvas.width / 2, this.canvas.height / 2);

            //do not continue to draw the other GUI
            return;
        }

        if (CubeShootingGame.state == CubeShootingGame.states.inGame) {
            ctx.font = "Normal " + textSize + "px dpcomic";
            ctx.textAlign = "left";
            ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
            ctx.fillText("Health: " + this.player.health, 2, textSize);

            ctx.textAlign = "right";
            ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
            ctx.fillText("Score: " + this.player.score, this.canvas.width - 2, textSize);

            ctx.textAlign = "left";
            ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
            ctx.fillText("Color: ", 2, textSize*2);

            var colorHex = ColorTypes.getColorStringFromType(this.player.currentColor);
            ctx.fillStyle = colorHex;
            ctx.fillRect(100, textSize*1.3, 70, 30);

            //ctx.textAlign = "center";
            //ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
            //ctx.fillText("Click on the cubes with the right color", this.canvas.width / 2 - 2, textSize * 2);
            //ctx.fillText("Press z, x or c to change color", this.canvas.width / 2 - 2, textSize * 3);

        }
        //draw the dot scope
        ctx.fillStyle = "rgba(245, 245, 245, 1.00)";
        ctx.fillRect(this.canvas.width / 2, this.canvas.height /2, 1, 1);
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
