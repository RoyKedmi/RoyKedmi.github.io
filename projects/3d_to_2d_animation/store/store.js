Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentModelPath: "",
        currentAnimationName: "",
        isAnimationPlaying: false,
        numberOfFrames: 10,
        currentFrame: 1,

        captureWidth: 1024,
        captureHeight: 1024,
        isCaptureVisible: true,
        postProcessingShaders: [],
    },
    mutations: {
        setCurrentModelPath(state, modelPath) {
            state.currentModelPath = modelPath;
        },
        setCurrentAnimationName(state, currentAnimationName) {
            state.currentAnimationName = currentAnimationName;
        },
        setNumberOfFrames(state, numberOfFrames) {
            state.numberOfFrames = numberOfFrames;
        },
        setCurrentFrame(state, currentFrame) {
            state.currentFrame = currentFrame;
        },
        setIsAnimationPlaying(state, isAnimationPlaying) {
            state.isAnimationPlaying = isAnimationPlaying;
        },
        setCaptureWidth(state, captureWidth) {
            state.captureWidth = captureWidth;
        },
        setCaptureHeight(state, captureHeight) {
            state.captureHeight = captureHeight;
        },
        setIsCaptureVisible(state, isCaptureVisible) {
            state.isCaptureVisible = isCaptureVisible;
        },
        addPostProcessingShader(state, newShader) {
            state.postProcessingShaders.push(newShader);
        },
    },
});
