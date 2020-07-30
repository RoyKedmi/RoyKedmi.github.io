import { AvailableShaders } from '../shaders/AvailableShaders.js'
import './ShaderCard.js'

console.log(AvailableShaders);

Vue.component('post-processing-menu', {
    methods: {
        addPostProcessingShader(shader) {
            //hack to deepcopy the uniforms
            let newShader = JSON.parse(JSON.stringify(shader));
            console.log(newShader);
            this.$store.commit('addPostProcessingShader', newShader);
        },
    },
    
    mounted() {
    },

    data: function () {
        return { 
                //availableShaders: [ {title: 'Pixel Shader'}, 
                //          {title: 'click me!'}, 
                //          {title: 'noice!'}],
                 availableShaders: AvailableShaders,
               };
    },

    props: [],
    watch: {
    },

    computed: {
        ...Vuex.mapState([
                'postProcessingShaders',
        ]),
    },

    template: `
                <v-card>
                  <v-card-title> Post Processing </v-card-title>
                  <v-card-text>
                    <div>
                      <v-menu open-on-hover offset-x>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on" color="primary">
                            Add Effect
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item
                            v-for="(item, index) in availableShaders"
                            :key="index"
                            @click="addPostProcessingShader(item)"
                          >
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-subheader class="pa-0 ma-0">Effects: </v-subheader>
                      <v-list>
                        <v-list-item
                          class="pa-0 ma-0"
                          v-for="(item, index) in postProcessingShaders"
                          :key="index"
                        >
                          <shader-card :shader="item">
                          </shader-card>
                        </v-list-item>
                      </v-list>
                      </div>
                  </v-card-text>
                </v-card>
              `
});
