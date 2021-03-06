
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css';


require('./bootstrap');

window.Vue = require('vue');


Vue.component('app-component', require('./components/AppComponent.vue').default);

Vue.use(Vuetify);
Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        // goal
        {
            path: '/goal',
            name: 'goal',
            component: () => import('./components/goal/Goal.vue'),
        },
        {
            path: '/goalcreate',
            name: 'goalcreate',
            component: () => import('./components/goal/Goalcreate.vue'),
        },
        // search
        {
            path: '/search',
            name: 'search',
            component: () => import('./components/search/Search.vue'),
        },
        // action
        {
            path: '/',
            redirect: `/action/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
        },
        {
            path: '/action/:year/:month',
            name: 'action',
            component: () => import('./components/action/Action.vue')
        },
        {
            path: '/action',
            redirect: `/action/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
        },
        // {
        //     path: '/actionsave',
        //     name: 'actionsave',
        //     component: () => import('./components/action/Actionsave.vue'),
        // },
        {
            path: '/actionsave/:selectDate',
            name: 'actionsave',
            component: () => import('./components/action/Actionsave.vue'),
        },
        {
            path: '/actionsave',
            name: 'actionsave',
            component: () => import('./components/action/Actionsave.vue'),
        },

    ]
});

const app = new Vue({
    el: '#app',
    router,
    vuetify: new Vuetify()
});






// routes: [
//     {
//         path: '/preview',
//         children:[
//             {
//               path: '/',
//               component: () => import('./components/molecules/PreviewList.vue'),
//             },
//             {
//               path: 'list',
//               component: () => import('./components/molecules/PreviewList.vue'),
//         ]
//     }
//   ]