import './ModelAnimationsMenu.js'
import './CaptureMenu.js'
import './PostProcessingMenu.js'
import * as THREE from '../assets/js/lib/threejs/build/three.module.js'
import { OBJLoader } from '../assets/js/lib/threejs/examples/jsm/loaders/OBJLoader.js'
import { FBXLoader } from '../assets/js/lib/threejs/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from '../assets/js/lib/threejs/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from '../assets/js/lib/threejs/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from '../assets/js/lib/threejs/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from '../assets/js/lib/threejs/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../assets/js/lib/threejs/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '../assets/js/lib/threejs/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from '../assets/js/lib/threejs/examples/jsm/postprocessing/ShaderPass.js';
import { PixelShader } from '../assets/js/lib/threejs/examples/jsm/shaders/PixelShader.js';
import { HighlightCaptureShader } from '../shaders/HighlightCaptureShader.js';

export default Vue.component('animation-app', {
    methods: {
        initThreeJs() {
            this.currentLoadedScene = null;
            //this.currentAnimations = ["AA"];
            this.previousTime = 0;
            this.currentAnimationAction = null;

            this.scene = new THREE.Scene();
            //this.scene.background = new THREE.Color(0x0);
            //this.scene.background = new THREE.Color(0xffffff);

            this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000);

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
            this.renderer.physicallyCorrectLights = true;
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.toneMappingExposure = 1.0;
            document.getElementById('renderer').appendChild(this.renderer.domElement);

            this.effectComposer = new EffectComposer(this.renderer);

            this.renderPass = new RenderPass(this.scene, this.camera);
            this.effectComposer.addPass(this.renderPass);

            this.pixelPass = new ShaderPass(PixelShader);
            this.effectComposer.addPass(this.pixelPass);

            this.highlightCapturePass = new ShaderPass(HighlightCaptureShader);
            this.effectComposer.addPass(this.highlightCapturePass);

            //this.glitchPass = new GlitchPass();
            //this.effectComposer.addPass(this.glitchPass);
            
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.camera.position.set( 0, 20, 100 );
            this.controls.update();

            this.hemisphereLight = new THREE.HemisphereLight();
            this.hemisphereLight.position.set( 0, 0, -100);
            this.scene.add( this.hemisphereLight );

            this.ambientLight = new THREE.AmbientLight(0xffffff, 2.3);
            //this.camera.add(this.ambientLight);
            this.scene.add(this.ambientLight);

            this.directionalLight = new THREE.DirectionalLight(0xffffff, 4.5);
            //this.directionalLight.position.set(0.5, 0.0, 0.866);
            this.scene.add(this.directionalLight);
            //this.camera.add(this.directionalLight);

            //Trying some promises here
            this.loadEnvironment().then(( { environmentMap }) => {
                this.environmentMap = environmentMap;
                this.scene.environment = this.environmentMap;
                //this.scene.background = this.environmentMap;

            });

            requestAnimationFrame((time) => this.render(time));

            window.addEventListener('resize', () => this.onWindowResize(), false);
        },

        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
        },

        onClickLoadButton() {
            //this.$store.commit('setCurrentModelPath', './assets/models/wolf/scene.gltf');
            this.$store.commit('setCurrentModelPath', './assets/models/phoenix/scene.gltf');
        },

        loadModel() {
            var objLoader = new GLTFLoader();
            objLoader.load(this.currentModelPath,
                          (obj) => {
                              this.setCurrentModel(obj);
                          },
                          function(xhr) {
                              console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                          },
                          function(error) {
                              console.log("error loading object", error);
                          });
        },

        loadEnvironment() {
            const path = "./assets/environments/venice_sunset_1k.hdr";

            var pmremGenerator = new THREE.PMREMGenerator(this.renderer);
            pmremGenerator.compileEquirectangularShader();

            return new Promise( (resolve, reject) => {
                new RGBELoader()
                    .setDataType(THREE.UnsignedByteType)
                    .load(path, (texture) => {
                        const environmentMap = pmremGenerator.fromEquirectangular(texture).texture;
                        pmremGenerator.dispose();
                        resolve( { environmentMap } );
                }, undefined, reject);
            });
        },

        setCurrentModel(obj) {
            const scene = obj.scene || obj.scenes[0];
            const animations = obj.animations || [];
            const box = new THREE.Box3().setFromObject(scene);
            const sceneSize = box.getSize(new THREE.Vector3()).length();
            const sceneCenter = box.getCenter(new THREE.Vector3());

            this.currentLoadedScene = scene;

            scene.position.x += (scene.position.x - sceneCenter.x);
            scene.position.y += (scene.position.y - sceneCenter.y);
            scene.position.z += (scene.position.z - sceneCenter.z);

            this.controls.maxDistance = sceneSize * 10;
            this.camera.near = sceneSize / 100;
            this.camera.far = sceneSize * 100;

            this.camera.updateProjectionMatrix();

            this.camera.position.copy(sceneCenter);
            this.camera.position.x += sceneSize / 2.0;
            this.camera.position.y += sceneSize / 5.0;
            this.camera.position.z += sceneSize / 2.0;
            this.camera.lookAt(sceneCenter);

            this.directionalLight.position.copy(sceneCenter);
            this.directionalLight.position.y += sceneSize / 5.0;

            this.scene.add(scene);

            scene.traverse((node) => {
              if (node.isLight) {
                //this.state.addLights = false;
              } else if (node.isMesh) {
                // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
                node.material.envMap = this.environmentMap;
                node.material.side = THREE.DoubleSide;
                //node.material.depthWrite = !node.material.transparent;
              }
            });

            this.animationMixer = new THREE.AnimationMixer(this.currentLoadedScene);

            this.currentAnimations = animations;
            //let clip = animations[0];
            //this.currentAnimationAction = this.animationMixer.clipAction(clip);
            //this.currentAnimationAction.stop();
            //this.currentAnimationAction.reset();
            //this.currentAnimationAction.play();

        },

        changeAnimation() {
            this.$store.commit("setIsAnimationPlaying", true);
            var animationName = this.currentAnimationName;
            if (this.currentAnimationAction) {
                this.currentAnimationAction.stop();
                this.currentAnimationAction.reset();
            }
            this.currentAnimationAction = null;
            let clip = this.currentAnimations.find(element => element.name == animationName);
            if (clip) {
                this.currentAnimationDuration = clip.duration;
                this.currentAnimationAction = this.animationMixer.clipAction(clip);
                this.currentAnimationAction.stop();
                this.currentAnimationAction.reset();
                this.currentAnimationAction.play();
            }
        },

        setAnimationTime(animationTime) {
            this.$store.commit("setIsAnimationPlaying", false);
            if (this.currentAnimationAction) {
                //this.currentAnimationAction.stop();
                //this.currentAnimationAction.reset();
                this.animationMixer.setTime(animationTime);
            }
        },

        render(time) {
            requestAnimationFrame((time) => this.render(time));

            const dt = (time - this.previousTime) / 1000;
            this.previousTime = time;

            this.controls.update();
            if (this.animationMixer && this.isAnimationPlaying) {
                this.animationMixer.update(dt);
            }

            this.updateShaders(time);
            this.effectComposer.render();
            //this.renderer.render(this.scene, this.camera);
        },

        updateShaders(time) {
            this.highlightCapturePass.uniforms['canvasSize'].value.x = this.renderer.domElement.width;
            this.highlightCapturePass.uniforms['canvasSize'].value.y = this.renderer.domElement.height;
            this.highlightCapturePass.uniforms['captureSize'].value.x = this.$store.state.captureWidth;
            this.highlightCapturePass.uniforms['captureSize'].value.y = this.$store.state.captureHeight;
            this.highlightCapturePass.uniforms['isCaptureVisible'].value = this.$store.state.isCaptureVisible;

            this.pixelPass.uniforms['resolution'].value = new THREE.Vector2(this.renderer.domElement.width, this.renderer.domElement.height);
            this.pixelPass.uniforms['pixelSize'].value = 5;
        },
    },
    
    computed: {
        ...Vuex.mapState([
            'currentModelPath',
            'currentAnimationName',
            'isAnimationPlaying',
        ]),
    },

    watch: {
        currentModelPath(newPath) {
            this.loadModel();
        },
        currentAnimationName(newName) {
            this.changeAnimation();
        },
    },

    mounted() {
        this.initThreeJs();
    },

    data: function () {
        return { currentAnimations: [], 
                 currentAnimationDuration: 0,
               };
    },

    template: `
                <v-app>
                    <div id="renderer">
                    </div>
                    <v-app-bar app clipped-left clipped-right>
                    </v-app-bar>
                    <v-navigation-drawer app clipped disable-resize-watcher>
                        <post-processing-menu>
                        </post-processing-menu>
                        <v-btn @click="onClickLoadButton" color="primary">
                            Load Model
                        </v-btn>
                    </v-navigation-drawer>
                    <v-navigation-drawer app clipped right disable-resize-watcher>
                        <model-animations-menu :animations=this.currentAnimations>
                        </model-animations-menu>
                        <capture-menu @setAnimationTime="setAnimationTime" :currentAnimationDuration=this.currentAnimationDuration>
                        </capture-menu>
                    </v-navigation-drawer>
                </v-app>
              `
});
