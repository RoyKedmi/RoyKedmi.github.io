import * as THREE from '../assets/js/lib/threejs/build/three.module.js'

var HighlightCaptureShader = {
    uniforms: {
        "tDiffuse": { value: null },
        "canvasSize": new THREE.Uniform( new THREE.Vector2()),
        "captureSize": new THREE.Uniform( new THREE.Vector2()),
        "isCaptureVisible": { value: true },
    },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform vec2 canvasSize;
        uniform vec2 captureSize;
        uniform bool isCaptureVisible;
        varying vec2 vUv;

        void main() {
            vec4 texel = texture2D(tDiffuse, vUv);

            if (!isCaptureVisible) {
                gl_FragColor = vec4(texel);
                return;
            }
            vec2 coords = gl_FragCoord.xy;
            vec2 middle = canvasSize / 2.0;
            vec2 boundsStart = vec2(middle.x - (captureSize.x / 2.0), middle.y - (captureSize.y / 2.0));

            if (coords.x < boundsStart.x || 
                coords.y < boundsStart.y || 
                coords.y > boundsStart.y + captureSize.y ||
                coords.x > boundsStart.x + captureSize.x) {
                gl_FragColor = vec4(texel.rgb, 0.8);
            } else {
                gl_FragColor = vec4(texel);
            }
        }
    `,

};

export { HighlightCaptureShader };
