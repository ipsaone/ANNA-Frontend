import Vue from 'vue';
import Vuex from 'vuex';

import users from './users';
import posts from './posts';
import statuses from './statuses';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        users,
        posts,
        statuses,
    }
});