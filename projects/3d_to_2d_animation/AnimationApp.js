import * as THREE from './assets/js/lib/threejs/build/three.module.js'
import { OBJLoader } from './assets/js/lib/threejs/examples/jsm/loaders/OBJLoader.js'
import { FBXLoader } from './assets/js/lib/threejs/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from './assets/js/lib/threejs/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from './assets/js/lib/threejs/examples/jsm/controls/OrbitControls.js'

Vue.component('animation-app', {
    methods: {
        initThreeJs() {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xffffff);

            this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            document.getElementById("renderer").appendChild(this.renderer.domElement);

            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.camera.position.set( 0, 20, 100 );
            this.controls.update();

            var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 4.75 );
            light.position.set( 0, 0, -100);
            this.scene.add( light );

            var ambientLight = new THREE.AmbientLight(0x0, 2.5);
            this.scene.add( ambientLight);

            var directionalLight = new THREE.DirectionalLight( 0xffffff, 4.5 );
            this.scene.add( directionalLight );

            requestAnimationFrame(() => this.render());
        },

        loadModel() {
            console.log("loadModel");
            var objLoader = new GLTFLoader();
            //objLoader.load('./assets/models/phoenix/scene.gltf',
            objLoader.load('./assets/models/wolf/scene.gltf',
                          (obj) => {
                              console.log("Adding to scene", obj);
                              this.scene.add(obj.scene);
                              console.log(this);
                          },
                          function(xhr) {
                              console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                          },
                          function(error) {
                              console.log("error loading object", error);
                          });
        },

        render() {
            requestAnimationFrame(() => this.render());

            this.controls.update();

            this.renderer.render(this.scene, this.camera);
        },
    },
    
    mounted() {
        this.initThreeJs();
    },

    data: function () {
        return { };
    },

    template: `
                <v-app>
                    <div id="renderer">
                    </div>
                    <v-app-bar app clipped-left clipped-right>
                    </v-app-bar>
                    <v-navigation-drawer app clipped>
                        <v-btn @click="loadModel" color="primary">
                            Load Model
                        </v-btn>
                    </v-navigation-drawer>
                    <v-navigation-drawer app clipped right>
                    </v-navigation-drawer>
                </v-app>
              `
});

