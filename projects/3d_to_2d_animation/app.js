import AnimationApp from './components/AnimationApp.js'
import store from './store/store.js'

function main() {
    var app = new Vue({
        el: '#app',
        store: store,
        vuetify: new Vuetify({
            theme: {
                dark: true,
            },
        }),
        render: h => h(AnimationApp),
    });
}

main()
