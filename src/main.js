// Vue JS
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index';
import {sync} from 'vuex-router-sync';
import Notifications from 'vue-notification';
import Cookie from 'vue-cookie';

sync(store, router);
Vue.config.productionTip = false;

Vue.use(Cookie);
Vue.use(Notifications);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});