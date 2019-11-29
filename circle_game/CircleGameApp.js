export default class CircleGameApp {
    objectTypes = { GROUND : 0, WALL: 1, CIRCLE: 2, ENEMY: 3, BULLET: 4 };
    constructor() {
        this.box2DScale = 30;
        this.wallsThickness = 10;
        this.initalizeCSS();
        this.initalizeCanvas();
        this.initalizeBox2D();

        this.initalizeWorld();
        this.timesNotUpdated = 0;
        this.worldStepRate = 1 / 60;
        window.onclick = () => {
            this.createBouncyBox();
        };
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

        while (this.timesNotUpdated >= this.worldStepRate) {
            this.world.Step(this.worldStepRate, 10, 10);

            this.timesNotUpdated -= this.worldStepRate;
        }

        this.world.DrawDebugData();
        window.requestAnimationFrame(() => { 
            this.gameLoop();
        });
    }

    initalizeWorld() {
        let gravityX = 0.0;
        let gravityY = 9.8;
        this.world = new this.box2d.b2World(new this.box2d.b2Vec2(gravityX, gravityY), true);

        this.createHollowCircle();

        //initialize debug draw
        var debugDraw = new this.box2d.b2DebugDraw();
        var canvasContext = this.canvas.getContext("2d");
        
        debugDraw.SetSprite(canvasContext);
        debugDraw.SetDrawScale(this.box2DScale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(this.box2d.b2DebugDraw.e_shapeBit | this.box2d.b2DebugDraw.e_jointBit);

        this.world.SetDebugDraw(debugDraw);

        //assign the contact listener (for collision detection)
        //var contactListener = new this.box2d.b2ContactListener;
        //contactListener.BeginContact = onContact;
        //this.world.SetContactListener(contactListener);
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

    initalizeBox2D() {
        this.box2d = {
            b2Vec2            : Box2D.Common.Math.b2Vec2,
            b2BodyDef         : Box2D.Dynamics.b2BodyDef,
            b2Body            : Box2D.Dynamics.b2Body,
            b2FixtureDef      : Box2D.Dynamics.b2FixtureDef,
            b2Fixture         : Box2D.Dynamics.b2Fixture,
            b2World           : Box2D.Dynamics.b2World,
            b2MassData        : Box2D.Collision.Shapes.b2MassData,
            b2PolygonShape    : Box2D.Collision.Shapes.b2PolygonShape,
            b2CircleShape     : Box2D.Collision.Shapes.b2CircleShape,
            b2DebugDraw       : Box2D.Dynamics.b2DebugDraw,
            b2ContactListener : Box2D.Dynamics.b2ContactListener,
        };
    }

    createPolygon(positionX, positionY, width, height, angle, isDynamic, objectType) {
        var polyFixDef = new this.box2d.b2FixtureDef;
        polyFixDef.density = 1.0;
        polyFixDef.friction = 0.5;
        polyFixDef.restitution = 80.0;
        polyFixDef.userData = objectType;

        var polyBodyDef = new this.box2d.b2BodyDef;
        if (isDynamic) {
            polyBodyDef.type = this.box2d.b2Body.b2_dynamicBody;
        } else {
            polyBodyDef.type = this.box2d.b2Body.b2_staticBody;
        }

        polyBodyDef.position.x = positionX;
        polyBodyDef.position.y = positionY;
        polyBodyDef.userData = objectType;
        polyBodyDef.angle = angle * Math.PI / 180.0;
        polyFixDef.shape = new this.box2d.b2PolygonShape;
        polyFixDef.shape.SetAsBox(width, height);

        var polyBody = this.world.CreateBody(polyBodyDef);
        polyBody.CreateFixture(polyFixDef);

        return polyBody;
    }

    createBouncyBox() {
        var numberOfPolygons = 52;
        var worldCenterX = this.canvas.width / 2 / this.box2DScale;
        var worldCenterY = this.canvas.height / 2 / this.box2DScale;
        var polyPositionX = worldCenterX;
        var polyPositionY = worldCenterY;

        var minScreenSize = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
        minScreenSize = minScreenSize / 4;
        var radius = minScreenSize*1.6 / this.box2DScale;

        var polyWidth = minScreenSize / this.box2DScale;
        var polyHeight = this.wallsThickness / this.box2DScale;

        var middleSize = this.wallsThickness / 8 / this.box2DScale;
        this.createPolygon(polyPositionX, polyPositionY, middleSize*20, middleSize*20, 0, true, this.objectTypes.GROUND);
    }

    createHollowCircle() {
        var numberOfPolygons = 52;
        var worldCenterX = this.canvas.width / 2 / this.box2DScale;
        var worldCenterY = this.canvas.height / 2 / this.box2DScale;
        var polyPositionX = worldCenterX;
        var polyPositionY = worldCenterY;

        var minScreenSize = this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height;
        minScreenSize = minScreenSize / 4;
        var radius = minScreenSize*1.6 / this.box2DScale;

        var polyWidth = minScreenSize / this.box2DScale;
        var polyHeight = this.wallsThickness / this.box2DScale;

        var middleSize = this.wallsThickness / 8 / this.box2DScale;
        this.createPolygon(polyPositionX, polyPositionY, middleSize*20, middleSize*20, 0, true, this.objectTypes.GROUND);

        var angle = 0;
        var angleJumps = 360 / numberOfPolygons;
        for (let i = 0; i < numberOfPolygons; i++) {
            polyPositionX = Math.cos(angle*Math.PI/180)*radius + worldCenterX;
            polyPositionY = Math.sin(angle*Math.PI/180)*radius + worldCenterY;
            let angleToBox2DAngle = angle + 90;
            this.createPolygon(polyPositionX, polyPositionY, polyWidth, polyHeight, angleToBox2DAngle, false, this.objectTypes.GROUND);
            angle += angleJumps;
        }
    }
}
