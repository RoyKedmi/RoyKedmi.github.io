import FlappyBird from './FlappyBird.js'
import Box2dUtils from './Box2dUtils.js'
import PsuedoRandomGenerator from './PsuedoRandomGenerator.js'

export default class GeneticFlappyBirdApp {
    static OBJECT_TYPES = { WALL : 0, GROUND: 1, BIRD: 2 };
    static BIRD_X_VELOCITY = 4;
    constructor() {
        this.numOfBirds = 9;
        this.box2DScale = 30;
        this.wallsThickness = 30;
        this.worldSliceIndex = 0;
        this.viewportX = 0;
        this.generationCount = 0;
        this.initalizeCSS();
        this.initalizeCanvas();
        this.mutationRate = 0.001;
        this.allTimeBestScore = 0;
        this.simulationSpeedFactor = 20;
        //this.mapRandomSeed = 1337;
        //this.psuedoRandomGenerator = new PsuedoRandomGenerator(this.mapRandomSeed);

        this.pipesSpace = this.canvas.height / 5 / this.box2DScale;

        this.initalizeWorld();
        this.timesNotUpdated = 0;
        this.worldStepRate = 1 / 60;

        this.initalizeKeyHandlers();
        this.createFlappyBirds();
    }

    startGame() {
        this.lastDeltaTime = Date.now();
        this.gameLoop();
    }

    gameLoop() {
        var currentTime = Date.now();
        var deltaTime = (currentTime - this.lastDeltaTime) / 1000;

        this.lastDeltaTime = currentTime;
        this.timesNotUpdated += deltaTime;
        this.timesNotUpdated = this.timesNotUpdated*this.simulationSpeedFactor;

        while (this.timesNotUpdated >= this.worldStepRate) {
            this.world.Step(this.worldStepRate, 10, 10);
            this.updateFlappyBirds();
            this.updateViewport();
            this.updateWorld();

            this.timesNotUpdated -= this.worldStepRate;
        }

        this.draw();
        this.drawFlappyBirds();
        this.updateScoreBoard();
        this.checkNeedNewGeneration();
        window.requestAnimationFrame(() => { 
            this.gameLoop();
        });
    }

    checkNeedNewGeneration() {
        var isAllDead = true;
        for (let i = 0; i < this.flappyBirds.length; i++) {
            if (!this.flappyBirds[i].isDead) {
                isAllDead = false;
                break;
            }
        }

        if (!isAllDead) {
            return;
        }

        //reset world
        this.destroyAllBodies();
        this.worldSliceIndex = 0;
        this.viewportX = 0;
        this.createNewFlappyBirdGeneration();
        this.generateNextMapSlice();
    }

    updateFlappyBirds() {
        for (let i = 0; i < this.flappyBirds.length; i++) {
            this.flappyBirds[i].update(this.simulationSpeedFactor);
        }
    }

    drawFlappyBirds() {
        for (let i = 0; i < this.flappyBirds.length; i++) {
            this.flappyBirds[i].draw(this.canvas, this.viewportX);
        }
    }

    updateViewport() {
        var maxX = 0;
        for (let i = 0; i < this.flappyBirds.length; i++) {
            var positionDiffX = this.flappyBirds[i].getPositionXDiff();
            if (maxX < positionDiffX) {
                maxX = positionDiffX;
            }
        }
        this.viewportX = -1*maxX*this.box2DScale;
    }

    updateWorld() {
        this.removeBodiesOutsideView();

        var shouldGenerateIndex = parseInt(parseInt(-1*this.viewportX) / parseInt(this.canvas.width));
        shouldGenerateIndex += 2;
        if (shouldGenerateIndex > this.worldSliceIndex) {
            this.generateNextMapSlice();
        }
    }

    removeBodiesOutsideView() {
        var currentBody = this.world.GetBodyList();
        var nextBody = null;
        var count = 0;
        var maxObjectWidth = (this.canvas.width / 2 / this.box2DScale);
        while (currentBody) {
            count += 1;
            nextBody = currentBody.GetNext();
            if (currentBody.GetPosition().x + maxObjectWidth < -1*this.viewportX / this.box2DScale) {
                this.world.DestroyBody(currentBody);
            }

            currentBody = nextBody;
        }
        //console.log(count);
    }

    destroyAllBodies() {
        var currentBody = this.world.GetBodyList();
        var nextBody = null;
        var maxObjectWidth = (this.canvas.width / 2 / this.box2DScale);
        while (currentBody) {
            nextBody = currentBody.GetNext();
            this.world.DestroyBody(currentBody);

            currentBody = nextBody;
        }
    }

    draw() {
        let ctx = this.canvas.getContext("2d");

        ctx.save();
        this.clearCanvas();
        ctx.translate(this.viewportX, 0);
        this.world.DrawDebugData();
        ctx.restore();
    }

    clearCanvas() {
        var ctx = this.canvas.getContext("2d");

        ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createFlappyBirds() {
        var polyPositionX = this.canvas.width / 7 / 2 / this.box2DScale;
        var polyPositionY = this.canvas.height / 2 / 2 / this.box2DScale;
        var size = this.pipesSpace / 4;
        var angle = 0;

        this.flappyBirds = new Array(this.numOfBirds);
        for (let i = 0; i < this.flappyBirds.length; i++) {
            this.flappyBirds[i] = new FlappyBird(this.world, this.box2DScale, polyPositionX, polyPositionY, size);
            this.flappyBirds[i].generateRandomBrain();
            //polyPositionX += size*3;
        }
    }

    createNewFlappyBirdGeneration() {
        this.generationCount += 1;

        var polyPositionX = this.canvas.width / 7 / 2 / this.box2DScale;
        var polyPositionY = this.canvas.height / 2 / 2 / this.box2DScale;
        var size = this.pipesSpace / 4;
        var angle = 0;

        this.flappyBirds.sort(function(a, b) {return b.score - a.score});
        var sortedBirds = this.flappyBirds;
        if (this.allTimeBestScore < sortedBirds[0].score) {
            this.allTimeBestScore = sortedBirds[0].score;
        }
        this.flappyBirds = new Array(this.numOfBirds);
        for (let i = 0; i < this.flappyBirds.length; i++) {
            this.flappyBirds[i] = new FlappyBird(this.world, this.box2DScale, polyPositionX, polyPositionY, size);
            //if (i == 0 || i == 1) {
            if (i == 0) {
                this.flappyBirds[i].copyBrain(sortedBirds[0].brain);
            } else {
                //this.flappyBirds[i].generateCombinedBrain(sortedBirds[0].brain, sortedBirds[1].brain);
                this.flappyBirds[i].copyBrain(sortedBirds[0].brain);
                this.flappyBirds[i].mutateBrain(this.mutationRate);
            }
            //polyPositionX += size*3;
        }
    }

    initalizeKeyHandlers() {
        document.onkeydown = (e) => this.handleKeyDown(e);
        document.onkeyup = (e) => this.handleKeyUp(e);
    }

    handleKeyDown(e) {
        ////console.log(e.key);
        //if (e.key == "ArrowLeft") {
        //    this.viewportX += 20;
        //}

        //if (e.key == "ArrowRight") {
        //    this.viewportX -= 20;
        //}

        //if (e.key == " ") {
        //    console.log("Jumping");
        //}
    }

    handleKeyUp(e) {
    }

    initalizeWorld() {
        let gravityX = 0.0;
        let gravityY = 9.8;
        this.world = new Box2dUtils.box2d.b2World(new Box2dUtils.box2d.b2Vec2(gravityX, gravityY), true);

        //initialize debug draw
        var debugDraw = new Box2dUtils.box2d.b2DebugDraw();
        var canvasContext = this.canvas.getContext("2d");
        
        debugDraw.SetSprite(canvasContext);
        debugDraw.SetDrawScale(this.box2DScale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetFlags(Box2dUtils.box2d.b2DebugDraw.e_shapeBit | Box2dUtils.box2d.b2DebugDraw.e_jointBit);

        this.world.SetDebugDraw(debugDraw);

        this.generateNextMapSlice();

        //assign the contact listener (for collision detection)
        var contactListener = new Box2dUtils.box2d.b2ContactListener;
        contactListener.BeginContact = (contact) => this.onContact(contact);
        this.world.SetContactListener(contactListener);
    }

    onContact(contact) {
        var flappyBird = null;
        var otherObject = null;
        if (contact.GetFixtureA().GetUserData() == null ||
            contact.GetFixtureB().GetUserData() == null) {
            return;
        }

        if (contact.GetFixtureA().GetUserData().type == GeneticFlappyBirdApp.OBJECT_TYPES.BIRD) {
            flappyBird = contact.GetFixtureA().GetUserData();
            otherObject = contact.GetFixtureB().GetUserData();
        } else if (contact.GetFixtureB().GetUserData().type == GeneticFlappyBirdApp.OBJECT_TYPES.BIRD) {
            otherObject = contact.GetFixtureA().GetUserData();
            flappyBird = contact.GetFixtureB().GetUserData();
        }

        //console.log("flappyBird type: " + flappyBird.type);
        //console.log("otherObject type: " + otherObject.type);
        if (otherObject.type == GeneticFlappyBirdApp.OBJECT_TYPES.WALL ||
            otherObject.type == GeneticFlappyBirdApp.OBJECT_TYPES.GROUND) {
            flappyBird.die();
        }
    }

    generateNextMapSlice() {
        //bottom
        var scaledCanvasWidth = this.canvas.width / 2 / this.box2DScale;
        var polyPositionX = this.canvas.width / 2 / this.box2DScale;
        var polyPositionY = this.canvas.height / this.box2DScale;
        var polyWidth = this.canvas.width / 2 / this.box2DScale;
        var polyHeight = this.wallsThickness / 2 / this.box2DScale;
        var angle = 0;
        polyPositionX = polyPositionX + 2*scaledCanvasWidth*this.worldSliceIndex;
        Box2dUtils.createPolygon(this.world, polyPositionX, polyPositionY, polyWidth, polyHeight, angle, false, false, { type: GeneticFlappyBirdApp.OBJECT_TYPES.WALL });

        //top
        polyPositionX = this.canvas.width / 2 / this.box2DScale;
        polyPositionY = 0;
        polyWidth = this.canvas.width / 2 / this.box2DScale;
        polyHeight = this.wallsThickness / 2 / this.box2DScale;
        polyPositionX = polyPositionX + 2*scaledCanvasWidth*this.worldSliceIndex;
        Box2dUtils.createPolygon(this.world, polyPositionX, polyPositionY, polyWidth, polyHeight, angle, false, false, { type: GeneticFlappyBirdApp.OBJECT_TYPES.WALL });

        //don't create pipes for the first slice
        if (this.worldSliceIndex == 0) {
            //this.psuedoRandomGenerator.setRandomSeed(this.mapRandomSeed);
            this.worldSliceIndex += 1;
            return;
        }

        //create the pipes
        for (let i = 1; i < 4; i++) {
            polyWidth = this.canvas.width / 7 / 2 / this.box2DScale;
            //let height = this.psuedoRandomGenerator.getRandomFloatInRange(0.2, 0.8);
            let height = this.getRandomFloatBetween(0.2, 0.8);
            polyHeight = height*this.canvas.height / 1 / this.box2DScale;
            polyPositionX = ((this.canvas.width / 3)*i / this.box2DScale) - polyWidth;
            polyPositionY = 0 / this.box2DScale;
            polyPositionY -= this.pipesSpace;
            polyPositionX = polyPositionX + 2*scaledCanvasWidth*this.worldSliceIndex;
            Box2dUtils.createPolygon(this.world, polyPositionX, polyPositionY, polyWidth, polyHeight, angle, false, false, { type: GeneticFlappyBirdApp.OBJECT_TYPES.WALL });

            polyHeight = (1 - height)*this.canvas.height / 1 / this.box2DScale;
            polyPositionY = this.canvas.height / this.box2DScale;
            polyPositionY += this.pipesSpace;
            Box2dUtils.createPolygon(this.world, polyPositionX, polyPositionY, polyWidth, polyHeight, angle, false, false, { type: GeneticFlappyBirdApp.OBJECT_TYPES.WALL });
        }

        this.worldSliceIndex += 1;
    }

    getRandomFloatBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    initalizeCSS() {
        var cssData = `* { margin:0; padding:0; }
                         html, body { width:100%; height:100%; }
                         canvas { display:block; }`;

        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = cssData;

        document.body.appendChild(css);
    }

    initalizeCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = "#000000";
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        document.body.appendChild(this.canvas);
    }

    initalizeScoreBoard() {
    }

    updateScoreBoard() {
        var generationLabel = document.getElementById("generationLabel");
        generationLabel.innerText = "Generation: " + this.generationCount;

        var allTimeBestLabel = document.getElementById("allTimeBestLabel");
        allTimeBestLabel.innerText = "All Time Best Score: " + this.allTimeBestScore.toFixed(3);

        var scoreTable = document.getElementById("scoreTable");
        for (let i = 0; i < this.flappyBirds.length; i++) {
            scoreTable.deleteRow(-1);
        }
        scoreTable.deleteRow(-1);

        this.flappyBirds.sort(function(a, b) {return a.score - b.score});
        for (let i = 0; i < this.flappyBirds.length; i++) {
            var row = scoreTable.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerText = this.flappyBirds[i].score.toFixed(3);
        }

        var row = scoreTable.insertRow(0);
        var cell1 = row.insertCell(0);
        cell1.innerText = "Score:";

        var simulationSpeedSlider = document.getElementById("simulationSpeedSlider");
        this.simulationSpeedFactor = parseFloat(simulationSpeedSlider.value);

        var simulationSpeedLabel = document.getElementById("simulationSpeedLabel");
        simulationSpeedLabel.innerText = "Simulation Speed: " + this.simulationSpeedFactor;

        var mutationRateSlider = document.getElementById("mutationRateSlider");
        this.mutationRate = parseFloat(mutationRateSlider.value) / 100;

        var mutationRateLabel = document.getElementById("mutationRateLabel");
        mutationRateLabel.innerText = "Mutation Rate: " + parseFloat(this.mutationRate*100).toFixed(3) + "%";
        
    }
}
