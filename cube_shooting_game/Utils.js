
export default class Utils {
    static getRandomFloatBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    static getRandomIntBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    static lerpPositions(positionA, positionB, t) {
        var x = this.lerp(positionA.x, positionB.x, t);
        var y = this.lerp(positionA.y, positionB.y, t);
        var z = this.lerp(positionA.z, positionB.z, t);

        return { x: x, y: y, z:z };
    }

    static updatePosition(oldPosition, newPosition) {
        oldPosition.x = newPosition.x;
        oldPosition.y = newPosition.y;
        oldPosition.z = newPosition.z;
    }

    static addRotation(oldRotation, rotationFactors) {
        oldRotation.x += rotationFactors.x;
        oldRotation.y += rotationFactors.y;
        oldRotation.z += rotationFactors.z;
    }
}
