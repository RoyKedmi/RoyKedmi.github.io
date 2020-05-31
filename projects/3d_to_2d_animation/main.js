import './AnimationApp.js'

function main() {
    var app = new Vue({
        el: '#app',
        vuetify: new Vuetify({
            theme: {
                dark: true,
            },
        }),
    });
}

main()
