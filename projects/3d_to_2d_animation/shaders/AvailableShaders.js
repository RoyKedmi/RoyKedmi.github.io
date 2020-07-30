import { PixelShader } from '../assets/js/lib/threejs/examples/jsm/shaders/PixelShader.js';
import { GlitchPass } from '../assets/js/lib/threejs/examples/jsm/postprocessing/GlitchPass.js';
import { DigitalGlitch } from '../assets/js/lib/threejs/examples/jsm/shaders/DigitalGlitch.js';
import { FilmShader } from '../assets/js/lib/threejs/examples/jsm/shaders/FilmShader.js';

function removeExcludedUniforms(uniforms) {
    var result = {...uniforms};

    for (var key in result) {
        if (result.hasOwnProperty(key)) {
            if (ExcludedUniforms.includes(key)) {
                delete result[key];
            }
        }
    }

    return result;
}

var ExcludedUniforms = ['time', 'resolution', 'tDiffuse'];
var AvailableShaders = [
    { title: "Pixel Shader", type: PixelShader, uniforms: removeExcludedUniforms(PixelShader.uniforms)},
    { title: "Digital Glitch", type: DigitalGlitch, uniforms: removeExcludedUniforms(DigitalGlitch.uniforms)},
    { title: "Film Shader", type: FilmShader, uniforms: removeExcludedUniforms(FilmShader.uniforms)},
    //{ title: "Glitch Shader", type: GlitchPass },
];

export { AvailableShaders, ExcludedUniforms };
