Vue.component('model-animations-menu', {
    methods: {
        onButtonClick(e) {
            this.currentSelectedButton = e.currentTarget.name;
            let clip = this.animations.find(element => element.name == this.currentSelectedButton);
            if (clip) {
                this.currentDuration = clip.duration;
            } else {
                this.currentDuration = 0;
            }
            this.$store.commit("setCurrentAnimationName", this.currentSelectedButton);
        },

        getButtonColor(name) {
            return this.currentSelectedButton == name ? 'primary' : '' ;
        },
    },
    
    mounted() {
    },

    data: function () {
        return { currentSelectedButton: "No Animation",
                 currentDuration: 0,
                 numberOfFrames: 10,
                 currentFrame: 1,
               };
    },

    props: ['animations'],
    watch: {
        animations: function(newAnimations, oldAnimations) {
            this.onButtonClick({currentTarget: { name: newAnimations[0].name }});
        },

        currentFrame: function(newFrame, oldFrame) {
            let frameInterval = this.currentDuration / this.numberOfFrames;
            let animationTime = (newFrame - 1)*frameInterval;
            this.$emit('setAnimationTime', animationTime);
        },
    },

    template: `
                <v-card class="pb-2 mb-2">
                  <v-card-title> Animations </v-card-title>
                  <v-card-text>
                    <div>
                     <div>
                        <v-btn name="No Animation" @click=onButtonClick :color="getButtonColor('No Animation')">
                            No Animation
                        </v-btn>
                     </div>
                     <div v-for="animation in animations" :key="animation.name">
                        <v-btn :name="animation.name" @click=onButtonClick :color="getButtonColor(animation.name)">
                            {{animation.name}}
                        </v-btn>
                     </div>
                    </div>
                    <div>
                    <!-- <v-divider class="mt-4 mb-4"></v-divider> -->
                    </div>
                  </v-card-text>
                </v-card>
              `
});
