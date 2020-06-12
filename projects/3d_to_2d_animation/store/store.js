Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentModelPath: "",
        currentAnimationName: "",
    },
    mutations: {
        setCurrentModelPath(state, modelPath) {
            state.currentModelPath = modelPath;
        },
        setCurrentAnimationName(state, currentAnimationName) {
            state.currentAnimationName = currentAnimationName;
        },
    },
});
