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
    retrieveLogs({commit, state}, force = false) {
        if (state.logs.length === 0 || force) {
            return LogsApi.getAll()
                .then(logs => commit('SET_ALL_LOGS', logs.data));
        }
        else {
            return Promise.resolve();
        }
    },

    selectLog({dispatch, commit, state}, id) {
        return dispatch('retrieveLogs')
            .then(_ => {
                const log = state.logs.filter(log => log.id === parseInt(id))[0];

                if (typeof log !== 'undefined') commit('SELECT_LOG', log);
                else throw Error;
            });
    },

    unselectLog({commit}) {
        return commit('SELECT_LOG', {});
    },

    storeLog({dispatch}, title, markdown, authorId) {
        return LogsApi.save({
            title: title,
            markdown: markdown,
            authorId: loggedUserId
        })
            .then(_ => dispatch('retrieveLogs', true));
    },

    deleteLog({dispatch}, id) {
        return LogsApi.delete(id)
            .then(_ => dispatch('retrieveLogs', true));
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
