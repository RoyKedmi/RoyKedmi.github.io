import * as THREE from '../assets/js/lib/threejs/build/three.module.js'
import ColorTypes from '../ColorTypes.js'
import EnemyCube from '../EnemyCube.js'
import EnemyAIBase from './EnemyAIBase.js'
import TextButton from '../TextButton.js'

export default class InstructionsAI extends EnemyAIBase {
    constructor(scene) {
        super(scene);
        this.meshesGroup = new THREE.Group();
        this.scene.add(this.meshesGroup);

        var positionOffset = -2;
        var colorTypes = ColorTypes.allColorTypes;
        for (let i = 0; i < colorTypes.length; i++) {
            var currentPosition = new THREE.Vector3(positionOffset, 0, 0);
            var enemyCube = new EnemyCube(this.meshesGroup, colorTypes[i], currentPosition);
            this.gameObjects.push(enemyCube);
            positionOffset += 2;
        }

        this.fontLoader = new THREE.FontLoader();
        this.fontLoader.load("../assets/fonts/DPComic_Regular.json", 
                             (font) => this.onFontFinishedLoading(font));

    }

    onFontFinishedLoading(font) {
        this.font = font;
        var fontSize = 1;
        this.text = new TextButton(this.meshesGroup, 
                                   this.font,
                                   "Click on the cubes with the right colors\n         Z, X, C to change colors",
                                   null,
                                   fontSize);

        this.text.setIsClickable(false);
        this.text.buttonMesh.position.z = -5;

        this.text.setMaterial(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    }

    setPosition(position) {
        this.meshesGroup.position.copy(position);
    }
}
