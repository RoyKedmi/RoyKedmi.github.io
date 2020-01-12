import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import TextButton from './TextButton.js'
import BrickPath from './BrickPath.js'

export default class MainMenu {
    static singleton = null;
    constructor(scene, onContinueClicked, onNewRunClicked, onExitClicked) {
        if (!MainMenu.singleton) {
            MainMenu.singleton = this;
        }

        this.onContinueClicked = onContinueClicked;
        this.onNewRunClicked = onNewRunClicked;
        this.onExitClicked = onExitClicked;
        this.scene = scene;

        this.continueButton = null;
        this.newRunButton = null;
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
        this.fontLoader.load("./assets/fonts/DPComic_Regular.json", 
                             (font) => this.onFontFinishedLoading(font));


        this.brickPath = new BrickPath(this.meshesGroup, 10, 150);
        this.brickPath.setPosition(new THREE.Vector3(0, -30, -50));
    }

    onFontFinishedLoading(font) {
        this.font = font;

        var fontSize = 5;
        this.continueButton = new TextButton(this.meshesGroup, this.font, 
                                              "Continue", 
                                              () => this.onContinueClicked(),
                                              fontSize);

        this.continueButton.buttonMesh.position.z = -1 * this.floorSize / 2;

        this.newRunButton = new TextButton(this.meshesGroup, this.font, 
                                           "New Run", 
                                           () => this.onNewRunClicked(),
                                           fontSize);

        this.newRunButton.buttonMesh.position.z = -1 * this.floorSize / 2;
        this.newRunButton.buttonMesh.position.y = -10;

        this.exitButton = new TextButton(this.meshesGroup, 
                                         this.font, 
                                         "Exit", 
                                         () => this.onExitClicked(),
                                         fontSize);
        this.exitButton.buttonMesh.position.z = -1 * this.floorSize / 2;
        this.exitButton.buttonMesh.position.y = -20;
    }

    update(deltaTime) {
        var objectToUpdate = [this.continueButton, this.newRunButton, this.exitButton];
        objectToUpdate.forEach((obj) => {
            if (obj) {
                obj.update(deltaTime);
            }
        });

        this.brickPath.update(deltaTime);
    }

    getCenterPosition() {
        return this.meshesGroup.position;
    }

    setIsShowContinue(isShowContinue) {
        this.isShowContinue = isShowContinue;
    }

    removeFloor() {
        this.meshesGroup.remove(this.floorMesh);
    }
}
