Vue.component('capture-menu', {
    methods: {
    },
    
    mounted() {
    },

    data: function () {
        return { };
    },

    props: ['currentAnimationDuration'],
    watch: {
        currentFrame: function(newFrame) {
            let frameInterval = this.currentAnimationDuration / this.numberOfFrames;
            let animationTime = (newFrame - 1)*frameInterval;
            this.$emit('setAnimationTime', animationTime);
        },
        currentAnimationDuration: function(newDuration) {
            let value = parseInt(newDuration / 0.1)
            this.$store.commit('setNumberOfFrames', value);
        },
    },

    computed: {
        timeBetweenFrames: function() {
            return this.currentAnimationDuration / this.numberOfFrames;
        },
        numberOfFrames: {
            get() {
                return this.$store.state.numberOfFrames;
            },
            set(value) {
                this.$store.commit('setNumberOfFrames', value);
            },
        },
        currentFrame: {
            get() {
                return this.$store.state.currentFrame;
            },
            set(value) {
                this.$store.commit('setCurrentFrame', value);
            },
        },
        captureWidth: {
            get() {
                return this.$store.state.captureWidth;
            },
            set(value) {
                this.$store.commit('setCaptureWidth', value);
            },
        },
        captureHeight: {
            get() {
                return this.$store.state.captureHeight;
            },
            set(value) {
                this.$store.commit('setCaptureHeight', value);
            },
        },
        isCaptureVisible: {
            get() {
                return this.$store.state.isCaptureVisible;
            },
            set(value) {
                this.$store.commit('setIsCaptureVisible', value);
            },
        },
    },

    template: `
                <v-card>
                  <v-card-title> Capture </v-card-title>
                  <v-card-text>
                    <div>
                    <p class="ma-0 pa-0"> Animation Duration: </p>
                    <p class="ma-0 pa-0 pb-2"> {{ currentAnimationDuration.toFixed(3) }} seconds</p>
                    <p class="ma-0 pa-0"> Time between frame: </p>
                    <p class="ma-0 pa-0 pb-2"> {{ timeBetweenFrames.toFixed(3) }} seconds</p>
                    <v-text-field min=1 label="Number of Frames" type='number' v-model.number:value="numberOfFrames"></v-text-field>
                    <v-subheader class="pa-0 ma-0">Current Frame</v-subheader>
                    <v-slider class="pt-3 my-0" v-model.number:value="currentFrame" :min=1 :max="numberOfFrames" thumb-size=24 thumb-label="always"></v-slider>
                    <v-text-field min=1 label="Capture Width" type='number' v-model.number:value="captureWidth"></v-text-field>
                    <v-text-field min=1 label="Capture Height" type='number' v-model.number:value="captureHeight"></v-text-field>
                    <v-switch label="Hide/Show Capture" v-model.number:value="isCaptureVisible"></v-switch>
                    <v-btn color="primary">Capture Animation</v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              `
});
