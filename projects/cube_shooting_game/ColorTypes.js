
export default class ColorTypes {
    static red = 0;
    static green = 1;
    static blue = 2;
    static allColorTypes = [ColorTypes.red, ColorTypes.green, ColorTypes.blue];

    static getColorValueFromType(type) {
        var colors = [0xff0000, 0x00ff00, 0x0000ff];
        return colors[type];
    }

    static getColorStringFromType(type) {
        var colors = ["#ff0000", "#00ff00", "#0000ff"];
        return colors[type];
    }
}
