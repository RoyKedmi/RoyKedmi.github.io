
export default class LSystem {
    static resultStringCache = [];

    constructor(initialPosition, initialAngle, turningAngle, initialString, rules, numberOfRecurtions, lineDistance, lineWidth, lineColor, linesPerSlowDraw, drawSlowly) {
        this.initialPosition = initialPosition;
        this.initialAngle = initialAngle;
        this.turningAngle = turningAngle;
        this.initialString = initialString;
        this.rules = rules;
        this.numberOfRecurtions = numberOfRecurtions;
        this.lineDistance = lineDistance;
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        this.linesPerSlowDraw = linesPerSlowDraw;
        this.drawSlowly = drawSlowly;

        this.positionAngleState = [];
        this.currentPosition = this.initialPosition;
        this.currentAngle = this.initialAngle;
        this.resultString = "";
        this.update();
        this.drawOffset = 0;
    }

    getResultStringFromCache() {
        var key = JSON.stringify({ initialString: this.initialString,
                    rules: this.rules,
                    numberOfRecurtions: this.numberOfRecurtions
                  });

        return LSystem.resultStringCache[key];
    }

    addResultStringToCache() {
        var key = JSON.stringify({ initialString: this.initialString,
                    rules: this.rules,
                    numberOfRecurtions: this.numberOfRecurtions
                  });

        LSystem.resultStringCache[key] = this.resultString;
    }

    update() {
        var constants = "[]+-|";
        var drawForward = "ABFG";
        var doNothing = "XY";

        var cachedString = this.getResultStringFromCache();
        if (cachedString) {
            //console.log("GOT RESULT STRING FROM CACHE");
            this.resultString = cachedString;
            return;
        }

        this.resultString = this.initialString;
        for (let n = 1; n <= this.numberOfRecurtions; n++) {
            var currentRecurtionResult = "";
            for (let i = 0; i < this.resultString.length; i++) {
                if (constants.indexOf(this.resultString[i]) != -1) {
                    currentRecurtionResult += this.resultString[i];
                    continue;
                }

                for (let j = 0; j < this.rules.length; j++) {
                    if (this.rules[j].indicator == this.resultString[i]) {
                        currentRecurtionResult += this.rules[j].turnTo;
                    }
                }
            }
            this.resultString = currentRecurtionResult;
            //console.log(this.resultString);
        }

        this.addResultStringToCache();
    }

    draw(canvas) {
        var drawForward = "ABFG";
        var doNothing = "XY";

        this.drawOffset += this.linesPerSlowDraw;

        var currentDrawOffset = 0;
        this.currentPosition = this.initialPosition;
        this.currentAngle = this.initialAngle;
        for (let i = 0; i < this.resultString.length; i++) {
            if (doNothing.indexOf(this.resultString[i]) != -1) {
                continue;
            }

            if (drawForward.indexOf(this.resultString[i]) != -1) {
                if (this.drawSlowly) {
                    if (currentDrawOffset <= this.drawOffset) {
                        currentDrawOffset += 1;
                      this.currentPosition = this.drawLineFromPointToDistance(canvas, this.currentPosition, this.lineDistance, this.currentAngle);
                    } else {
                        return;
                    }
                } else {
                    this.currentPosition = this.drawLineFromPointToDistance(canvas, this.currentPosition, this.lineDistance, this.currentAngle);
                }
            }

            switch (this.resultString[i]) {
                case "+":
                    this.currentAngle += this.turningAngle;
                    break;
                case "-":
                    this.currentAngle -= this.turningAngle;
                    break;
                case "[":
                    this.positionAngleState.push({position: this.currentPosition,
                                             angle: this.currentAngle });
                    break;
                case "]":
                    var state = this.positionAngleState.pop();
                    this.currentPosition = state.position;
                    this.currentAngle = state.angle;
                    break;
                case "|":
                    this.currentAngle += 180;
                    break;
                default:
                    break;
            }
        }
    }

    drawLineFromPointToDistance(canvas, from, distance, angle) {
        var angleInRadians = angle*Math.PI/180;
        var toPoint = { x: from.x + distance*Math.cos(angleInRadians),
                        y: from.y + distance*Math.sin(angleInRadians) };

        this.drawLineFromPointToPoint(canvas, from, toPoint);
        return toPoint;
    }
    
    drawLineFromPointToPoint(canvas, from, to) {
        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);

        ctx.strokeStyle = this.lineColor;
        ctx.fillStyle = this.lineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = "square";
        ctx.stroke();
    }
}
