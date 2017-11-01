import Vue from 'vue';
import Vuex from 'vuex';

import users from './users';
import posts from './posts';
import logs from './logs';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        users,
        posts,
        logs,
    }
});

export default store;