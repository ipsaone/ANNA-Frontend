// Vue JS
import Vue from 'vue';
import App from './App';
import router from './pages/router';
import store from './modules/store';
import {sync} from 'vuex-router-sync';

import Moment from 'vue-moment';
import Cookie from 'vue-cookie';
import Notifications from 'vue-notification';
import Modal from 'vue-js-modal';

sync(store, router);
Vue.config.productionTip = false;

Vue.use(Moment);
Vue.use(Cookie);
Vue.use(Notifications);
Vue.use(Modal, {dialog: true});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App},
    mounted: function() {
        idleLogout();
        checkLogged();
        checkInterval();
    }
});

async function checkLogged() {
    //console.log('Am I logged in?', store.getters.isLogged);
    if (!window.location.href.endsWith('login') && !window.location.href.endsWith('login/')){
        await store.dispatch('checkLoggedUser');
        if (!store.getters.isLogged){
            window.location.replace('/login');
        }
    }
}

function idleLogout() {
    var t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;  // catches touchscreen presses as well
    window.ontouchstart = resetTimer; // catches touchscreen swipes as well
    window.onclick = resetTimer;      // catches touchpad clicks as well
    window.onkeypress = resetTimer;
    window.addEventListener('scroll', resetTimer, true);

    function disconnect() {
        if (!window.location.href.endsWith('login') && !window.location.href.endsWith('login/')) {
            // Check login of the user, if no, reconnect

            alert('You have been inactive for too long');

            store.dispatch('logoutUser')
                .then(_ => {
                    window.location.replace('/login');
                });
        }
    }

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(disconnect, 30 * 60 * 1000);  // time is in milliseconds
    }
}

// Useful to disconnect user when backend stops
function checkInterval() {
    window.setInterval(function() {
        if(!window.location.href.endsWith('login') && !window.location.href.endsWith('login/')){
            checkLogged();
            //console.log('10 secondes');
        }
    }, 10000);
}
