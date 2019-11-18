import LogsApi from '@/modules/logs/logs_api';

const state = {
    logs: [],
    log: {}
};

const mutations = {
    SET_ALL_LOGS(state, logs) {
        state.logs = logs;
    },

    SELECT_LOG(state, log) {
        state.log = log;
    },

    CLEAR_LOG(state) {
        state.log = {};
    }
};

const actions = {
    async retrieveLogs({commit, state}, force = false) {
        if (state.logs.length === 0 || force) {
            let logs = await LogsApi.getAll();
            commit('SET_ALL_LOGS', logs.data);
        }
        else {
            return Promise.resolve();
        }
    },

    async selectLog({dispatch, commit, state}, id) {
        await dispatch('retrieveLogs');
           
        const log = state.logs.filter(log => log.id === parseInt(id))[0];

        if (typeof log !== 'undefined') commit('SELECT_LOG', log);
        else throw Error;
    },

    async unselectLog({commit}) {
        return commit('SELECT_LOG', {});
    },

    async storeLog({dispatch}, title, markdown) {
        await LogsApi.save({
            title: title,
            markdown: markdown,
            // authorId: loggedUserId
        });
        dispatch('retrieveLogs', true);
    },

    async deleteLog({dispatch}, id) {
        await LogsApi.delete(id);
        dispatch('retrieveLogs', true);
    }
};

const getters = {
    logs(state) {
        return state.logs;
    },

    selectedLog(state) {
        return state.log;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
