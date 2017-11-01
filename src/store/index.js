import Vue from 'vue';
import Vuex from 'vuex';

import users from './users';
import posts from './posts';
import statuses from './statuses';
import logs from './logs';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        users,
        posts,
        statuses,
        logs,
    }
});