import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/store/modules/auth';
import drive from '@/store/modules/drive';
import events from '@/store/modules/events';
import logs from '@/store/modules/logs';
import missions from '@/store/modules/missions';
import posts from '@/store/modules/posts';
import tasks from '@/store/modules/tasks';
import users from '@/store/modules/users';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        auth,
        drive,
        events,
        logs,
        missions,
        posts,
        tasks,
        users
    }
});

export default store;