import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import TextButton from './TextButton.js'

export default class MainMenu {
    static singleton = null;
    constructor(scene, onStoryModeClicked, onEndlessModeClicked, onExitClicked) {
        if (!MainMenu.singleton) {
            MainMenu.singleton = this;
        }

        this.onStoryModeClicked = onStoryModeClicked;
        this.onEndlessModeClicked = onEndlessModeClicked;
        this.onExitClicked = onExitClicked;
        this.scene = scene;

        this.storyModeButton = null;
        this.endlessModeButton = null;
        this.floorSize = 100;
        //create parent center of main menu room
        this.meshesGroup = new THREE.Group();
        this.scene.add(this.meshesGroup);

        this.meshesGroup.position.x = 10000;
        this.meshesGroup.position.y = 0;
        this.meshesGroup.position.z = 10000;
        //create floor
        var floorGeometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize);
        var material = new THREE.MeshBasicMaterial({color: 0xa0a0a0});
        //draw from both sides of the plane
        material.side = THREE.DoubleSide;
        this.floorMesh = new THREE.Mesh(floorGeometry, material);
        this.floorMesh.rotateX( -90*Math.PI / 180 );
        this.floorMesh.position.y = -30;
        this.meshesGroup.add(this.floorMesh);

        this.fontLoader = new THREE.FontLoader();
        this.fontLoader.load('./assets/fonts/DPComic_Regular.json', 
                             (font) => this.onFontFinishedLoading(font));
    }

    onFontFinishedLoading(font) {
        this.font = font;

        this.storyModeButton = new TextButton(this.meshesGroup, this.font, "Story Mode", () => this.onStoryModeClicked());
        this.storyModeButton.buttonMesh.position.z = -1 * this.floorSize / 2;

        this.endlessModeButton = new TextButton(this.meshesGroup, this.font, "Endless Mode", () => this.onEndlessModeClicked());
        this.endlessModeButton.buttonMesh.position.z = -1 * this.floorSize / 2;
        this.endlessModeButton.buttonMesh.position.y = -10;

        this.exitButton = new TextButton(this.meshesGroup, this.font, "Exit", () => this.onExitClicked());
        this.exitButton.buttonMesh.position.z = -1 * this.floorSize / 2;
        this.exitButton.buttonMesh.position.y = -20;
    }

    update(deltaTime) {
        var objectToUpdate = [this.storyModeButton, this.endlessModeButton, this.exitButton];
        objectToUpdate.forEach((obj) => {
            if (obj) {
                obj.update(deltaTime);
            }
        });
    }

    getCenterPosition() {
        return this.meshesGroup.position;
    }
}
