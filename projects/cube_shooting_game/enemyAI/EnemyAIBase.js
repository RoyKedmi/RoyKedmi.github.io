
export default class EnemyAIBase {
    constructor(scene) {
        this.scene = scene;
        this.isFinished = false;
        this.gameObjects = [];
    }

    update(deltaTime) {
        this.gameObjects.forEach((gameObject) => {
            gameObject.update(deltaTime);
        });
    }
}
