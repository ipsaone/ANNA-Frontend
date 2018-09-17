import Vue from 'vue';
import Vuex from 'vuex';

import createPersistedState from 'vuex-persistedstate';

import auth from '@/modules/auth/auth_store.js';
import drive from '@/modules/drive/drive_store.js';
import events from '@/modules/events/events_store.js';
import logs from '@/modules/logs/logs_store.js';
import missions from '@/modules/missions/missions_store.js';
import posts from '@/modules/blog/posts_store.js';
import tasks from '@/modules/missions/tasks_store.js';
import users from '@/modules/users/users_store.js';
import groups from '@/modules/groups/groups_store.js';

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
        users,
        groups
    },
    plugins: [createPersistedState()]
});

export default store;
