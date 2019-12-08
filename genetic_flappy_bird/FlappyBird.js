import Box2dUtils from './Box2dUtils.js'
import GeneticFlappyBirdApp from './GeneticFlappyBirdApp.js'

export default class FlappyBird {
    constructor(world, box2DScale, jumpImpulseHeight, startingPositionX, startingPositionY, size) {
        this.world = world;
        this.box2DScale = box2DScale;
        this.startingPositionX = startingPositionX;
        this.startingPositionY = startingPositionY;
        this.size = size;
        this.type = GeneticFlappyBirdApp.OBJECT_TYPES.BIRD;
        this.isDead = false;
        this.score = 0;
        this.numOfRaycasts = 20;
        this.raycastLength = 1000;
        this.raycastFractions = new Array(this.numOfRaycasts);
        this.raycastPoints = new Array(this.numOfRaycasts);
        this.raycastIndex = 0;
        this.resetRaycastArrays();
        this.lastTimeJumped = 0;
        this.jumpCooldown = 300;
        this.jumpImpulseHeight = jumpImpulseHeight;

        this.brain = null;
        this.body = Box2dUtils.createPolygon(this.world, this.startingPositionX, this.startingPositionY, size, size, 0, true, true, this);
        let velocity = this.body.GetLinearVelocity();
        velocity.x = GeneticFlappyBirdApp.BIRD_X_VELOCITY; 
    }

    update(simulationSpeedFactor) {
        if (this.isDead) {
            return;
        }

        this.score = this.body.GetPosition().x - this.startingPositionX;

        //let velocity = this.body.GetLinearVelocity();
        //velocity.x = GeneticFlappyBirdApp.BIRD_X_VELOCITY; 
        this.getRaycastData();
        this.activateBrain(simulationSpeedFactor);
    }

    jump(simulationSpeedFactor) {
        if (Date.now() - this.lastTimeJumped > this.jumpCooldown/simulationSpeedFactor) {
            this.lastTimeJumped = Date.now();
            let velocity = this.body.GetLinearVelocity();
            velocity.y = 0;
            this.body.ApplyImpulse(new Box2dUtils.box2d.b2Vec2(0, this.jumpImpulseHeight), this.body.GetWorldCenter());
        }
    }

    die() {
        //console.log("Dead! Score: " + this.score);
        this.isDead = true;
        this.body.SetType(Box2dUtils.box2d.b2Body.b2_staticBody);
    }

    getPositionXDiff() {
        return this.body.GetPosition().x - this.startingPositionX;
    }

    getRaycastData() {
        var birdCenter = this.body.GetWorldCenter();
        var rayTraceLength = this.raycastLength / this.box2DScale;
        var firstPoint = new Box2dUtils.box2d.b2Vec2(birdCenter.x + rayTraceLength, birdCenter.y);
        var firstPointCentered = new Box2dUtils.box2d.b2Vec2(rayTraceLength, 0);
        var currentPoint = firstPoint;
        var angle = -1 * (360 / (this.numOfRaycasts))*(Math.PI / 180);
        var currentAngle = 0;

        var i = 0;
        for (i = 0; i < this.numOfRaycasts; i++) {
            this.raycastIndex = i;
            this.raycastPoints[this.raycastIndex].x = currentPoint.x;
            this.raycastPoints[this.raycastIndex].y = currentPoint.y;
            this.raycastFractions[this.raycastIndex] = 0;
            this.world.RayCast((fix, p, n, fra) => this.raycastCallback(fix, p, n, fra), this.body.GetWorldCenter(), currentPoint);

            currentAngle += angle;
            currentPoint.x = firstPointCentered.x*Math.cos(currentAngle) - firstPointCentered.y*Math.sin(currentAngle);
            currentPoint.y = firstPointCentered.y*Math.cos(currentAngle) + firstPointCentered.x*Math.sin(currentAngle);
            currentPoint.x += birdCenter.x;
            currentPoint.y += birdCenter.y;
        }

    }

    raycastCallback(fixture, point, normal, fraction) {
        if (fixture.GetUserData().type == GeneticFlappyBirdApp.OBJECT_TYPES.WALL) {
            var currentFraction = (1.0 - fraction);
            if (this.raycastFractions[this.raycastIndex] < currentFraction) {
                this.raycastFractions[this.raycastIndex] = currentFraction;
                this.raycastPoints[this.raycastIndex] = point;
            }

            return fraction;
        } 
    }

    draw(canvas, viewportX) {
        if (!this.isDead) {
            this.drawRaycasts(canvas, viewportX);
        }
    }

    drawRaycasts(canvas, viewportX) {
        var centerX = this.body.GetWorldCenter().x * this.box2DScale;
        var centerY = this.body.GetWorldCenter().y * this.box2DScale;
        var currentX = 0;
        var currentY = 0;
        
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(0, 102, 255, 0.3';
        var i = 0;
        for (i = 0; i < this.numOfRaycasts; i++) {
            currentX = this.raycastPoints[i].x * this.box2DScale;
            currentY = this.raycastPoints[i].y * this.box2DScale;

            //don't draw if values are not initalized
            if (currentX != 0 && currentY != 0) {
                ctx.save();
                ctx.translate(viewportX, 0);
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    resetRaycastArrays() {
        this.raycastFractions = new Array(this.numOfRaycasts);
        this.raycastPoints = new Array(this.numOfRaycasts);

        var i = 0;
        for (i = 0; i < this.numOfRaycasts; i++) {
            this.raycastPoints[i] = new Box2dUtils.box2d.b2Vec2(0, 0);
            this.raycastFractions[i] = this.raycastLength;
        }
    }

    generateRandomBrain() {
        //num of layers in the brain
        var numLayers = 3;
        var numWeightsSecondLayer = 16;
        this.brain = new Array(numLayers);
        this.brain[0] = new Array(numWeightsSecondLayer);
        this.brain[1] = new Array(numWeightsSecondLayer);
        this.brain[2] = new Array(1);

        for (let i = 0; i < this.brain[0].length; i++) {
            this.brain[0][i] = new Array(this.numOfRaycasts);
            for (let j = 0; j < this.brain[0][i].length; j++) {
                this.brain[0][i][j] = this.getRandomFloatBetween(-1.0, 1.0);
            }
        }

        for (let i = 0; i < this.brain[1].length; i++) {
            this.brain[1][i] = new Array(numWeightsSecondLayer);
            for (let j = 0; j < this.brain[1][i].length; j++) {
                this.brain[1][i][j] = this.getRandomFloatBetween(-1.0, 1.0);
            }
        }

        for (let i = 0; i < this.brain[2].length; i++) {
            this.brain[2][i] = new Array(numWeightsSecondLayer);
            for (let j = 0; j < this.brain[2][i].length; j++) {
                this.brain[2][i][j] = this.getRandomFloatBetween(-1.0, 1.0);
            }
        }
    }

    generateCombinedBrain(brain1, brain2) {
        this.generateRandomBrain();
        for (let i = 0; i < this.brain.length; i++) {
            for (let j = 0; j < this.brain[i].length; j++) {
                for (let k = 0; k < this.brain[i][j].length; k++) {
                    if (this.getRandomFloatBetween(0.0, 1.0) <= 0.5) {
                        this.brain[i][j][k] = brain2[i][j][k];
                    } else {
                        this.brain[i][j][k] = brain1[i][j][k];
                    }
                }
            }
        }
    }

    copyBrain(brain1) {
        this.generateRandomBrain();
        for (let i = 0; i < this.brain.length; i++) {
            for (let j = 0; j < this.brain[i].length; j++) {
                for (let k = 0; k < this.brain[i][j].length; k++) {
                        this.brain[i][j][k] = brain1[i][j][k];
                }
            }
        }
    }

    mutateBrain(mutationRate) {
        var weightsCount = 0;
        for (let i = 0; i < this.brain.length; i++) {
            for (let j = 0; j < this.brain[i].length; j++) {
                for (let k = 0; k < this.brain[i][j].length; k++) {
                    weightsCount += this.brain[i][j].length;
                }
            }
        }

        var weightsToMutate = Math.floor(mutationRate*weightsCount);
        for (let i = 0; i < weightsToMutate; i++) {
            var firstIndex = this.getRandomIntBetween(0, this.brain.length);
            var secondIndex = this.getRandomIntBetween(0, this.brain[firstIndex].length);
            var thirdIndex = this.getRandomIntBetween(0, this.brain[firstIndex][secondIndex].length);

            this.brain[firstIndex][secondIndex][thirdIndex] = this.getRandomFloatBetween(-1.0, 1.0);
        }
    }

    activateBrain(simulationSpeedFactor) {
        var layerResults = [[], [], []];
        for (let i = 0; i < this.brain[0].length; i++) {
            var sum = 0;
            for (let j = 0; j < this.raycastFractions.length; j++) {
                sum += this.raycastFractions[j]*this.brain[0][i][j];
            }
            layerResults[0].push(this.sigmoid(sum));
        }

        for (let i = 0; i < this.brain[1].length; i++) {
            var sum = 0;
            for (let j = 0; j < layerResults[0].length; j++) {
                sum += layerResults[0][j]*this.brain[1][i][j];
            }
            layerResults[1].push(this.sigmoid(sum));
        }

        for (let i = 0; i < this.brain[2].length; i++) {
            var sum = 0;
            for (let j = 0; j < layerResults[1].length; j++) {
                sum += layerResults[1][j]*this.brain[2][i][j];
            }
            layerResults[2].push(this.sigmoid(sum));
        }

        //console.log(layerResults);
        if (layerResults[2][0] > 0.5) {
            this.jump(simulationSpeedFactor);
        }
    }

    getRandomFloatBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    getRandomIntBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    sigmoid(x) {
        return (1/(1 + Math.pow(Math.E, -1*x)));
    }
}
