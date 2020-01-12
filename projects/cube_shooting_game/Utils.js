import * as THREE from './assets/js/lib/threejs/build/three.module.js'

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
    static createBurnShaderMaterial(originalColor, squareNumber) {
        var vertexShader = `
            uniform float time;
            uniform vec2 resolution;
            varying vec4 pos;
            void main() {
                pos = vec4(position, 0.0) + vec4(0.5, 0.5, 0.5, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `;

        var fragmentShader = `
            uniform float time;
            uniform vec2 resolution;
            uniform vec3 original_color;
            uniform float dissolve;
            uniform float square_number;
            varying vec4 pos;

            float rand(vec2 n) { 
                return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float noise(vec2 p){
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);
                
                float res = mix(
                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);

                return res*res;
            }

            vec4 get_grad_color(float step) {
                float r = 1.0 - smoothstep(0.0, 1.0, step);
                //float g = smoothstep(0.0, 0.13, step) - smoothstep(0.0, 0.18, step);
                float g = 0.0;
                float c = smoothstep(0.2, 1.0, step);
                //float a = smoothstep(0.0, 1.0, step);
                float a = 1.0;

                return vec4(r + c, g + c, c, a);
            }

            //This function will return the right coordinates for the texture
            //based on which side of the cube we are on
            vec2 get_cube_coords() {
                if (pos.x == 1.0) {
                    return vec2(pos.z, pos.y);
                }
                if (pos.x == 0.0) {
                    return vec2(pos.z, pos.y);
                }
                if (pos.y == 1.0) {
                    return vec2(pos.z, pos.x);
                }
                if (pos.y == 0.0) {
                    return vec2(pos.z, pos.x);
                }
                if (pos.z == 1.0) {
                    return vec2(pos.x, pos.y);
                }
                if (pos.z == 0.0) {
                    return vec2(pos.x, pos.y);
                }
            }

            void main() {

                ////First dissolve effect
                //vec2 position = get_cube_coords();
                //vec2 scale = vec2(position.x, position.y)*7.0;
                //float val = noise(scale);
                //vec4 color = vec4(val, val, val, 1.0);
                //float a = floor(dissolve + val);
                //
                //float d = (dissolve*2.0  + val) - 1.0;
                //d = clamp(0.0, 1.0, d);

                //color = vec4(original_color, 1.0);
                ////color *= get_grad_color(d);
                //color.a = d;

                //gl_FragColor = color;

                //Square dissolve effect
                vec2 position = get_cube_coords();
                position *= square_number;
                position = fract(position);
                //st.x *= resolution.x / resolution.y;
                float d = 1.0 - dissolve;
                float pct = step(d, position.x)*step(d, position.y);
                pct *= step(d, 1.0 - position.x)*step(d, 1.0 - position.y);
                gl_FragColor = vec4(original_color, pct);
            }
            `;

        var uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() },
            original_color: { type: "v3", value: originalColor },
            square_number: { type: "f", value: squareNumber},
            dissolve: { type: "f", value: 1.0 },
        };

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        material.transparent = true;
        return material;
    }

    static createBrickPathMaterial() {
        var vertexShader = `
            uniform float time;
            uniform vec2 resolution;
            varying vec4 pos;
            void main() {
                pos = vec4(position, 0.0) + vec4(0.5, 0.5, 0.5, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `;

        var fragmentShader = `
            const int complexity      = 47;
            const float fluid_speed     = 1018.0;
            const float color_intensity = 0.8;
            const float position_extra = 0.05;
            uniform float time;
            uniform float player_position;
            uniform vec2 plane_size;
            varying vec4 pos;

            void main( void ) {
                vec2 p = pos.yx / plane_size.yx;
                float c = 1.0 - step(player_position + position_extra + sin(3.0*time)/100.0, p.x);
                
                for(int i=1;i<complexity;i++)
                {
                    vec2 newp=p + time*0.0101;
                    newp.x+=0.6/float(i)*sin(float(i)*p.y+time/fluid_speed+0.3*float(i)) + 0.5;
                    newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed+0.3*float(i+10)) - 0.5;
                    p=newp;
                }
                
                vec3 col=vec3(color_intensity*sin(3.0*p.x)+color_intensity,color_intensity*sin(3.0*p.y)+color_intensity,color_intensity*sin(p.x+p.y)+color_intensity);
                gl_FragColor=vec4(col*c, c);
            }
            `;

        var uniforms = {
            time: { type: "f", value: 1.0 },
            plane_size: { type: "v2", value: new THREE.Vector2() },
            player_position: { type: "f", value: 0.0 },
        };

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        material.transparent = true;
        return material;
    }
}
