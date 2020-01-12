
export default class Box2dUtils {
    static box2d = {
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

    static createPolygon(world, positionX, positionY, width, height, angle, isDynamic, isSensor, objectType) {
        var polyFixDef = new this.box2d.b2FixtureDef;
        polyFixDef.density = 1.0;
        polyFixDef.friction = 0.5;
        polyFixDef.restitution = 0.0;
        polyFixDef.userData = objectType;
        polyFixDef.isSensor = isSensor;

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

        var polyBody = world.CreateBody(polyBodyDef);
        polyBody.CreateFixture(polyFixDef);

        return polyBody;
    }
}
