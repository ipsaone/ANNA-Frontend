import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/store/modules/auth';
import users from '@/store/modules/users';
import posts from '@/store/modules/posts';
import logs from '@/store/modules/logs';
import drive from '@/store/modules/drive';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        auth,
        posts,
        logs,
        users,
        drive
    }
});

export default store;