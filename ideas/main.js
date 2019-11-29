import RandomWordsStimuli from './RandomWordsStimuli.js'

function initComponents() {
    var div = document.createElement('div');
    div.id = 'app';

    document.body.appendChild(div);
}

async function main() {
    //initComponents();

    //const RandomWordsStimuli = { template: '<div>Foo</div>' };
    const Dashboard = { template: '<div>Dashboard</div>' };
    const routes = [
        { path: '/random-words-stimuli', component: RandomWordsStimuli },
        { path: '/dashboard', component: Dashboard },
    ];

    const router = new VueRouter({
        routes: routes,
    });

    new Vue({
        el: '#app',
        router: router,
        vuetify: new Vuetify({
            theme: { dark: true,
                   }
        }),
        data: () => ({
            isDrawerOpen: true,
        })
    });
}

main()
