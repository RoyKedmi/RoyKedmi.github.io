Vue.component('shader-card', {
    methods: {
    },
    data: function () {
        return {show: false};
    },
    props: ['shader'],

    watch: {
    },

    computed: {
    },

    template: `
              <v-card elevation=10>
                <v-list-item>
                <v-card-title class="pl-0 ml-0" >{{ shader.title }}</v-card-title>
                  <v-btn icon @click="show = !show">
                    <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-list-item>
                <div>
                  <v-expand-transition>
                  <div v-show="show">
                    <v-list-item v-for="(value, name) in shader.uniforms" :key="name">
                      <div>
                        <v-text-field v-model="value.value" :label="name" :value="value.value" type="number"></v-text-field>
                      </div>
                    </v-list-item>
                    <v-card-actions>
                      <v-spacer></v-spacer>

                    </v-card-actions>
                  </div>
                  </v-expand-transition>
                </div>
              </v-card>
              `

});
