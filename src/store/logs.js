import LogsApi from '@/api/test/logs';

const state = {
    logs: [],
    log: {}
};

const mutations = {
    GET_ALL(state, logs) {
        state.logs = logs;
    },

    GET_LOG(state, log) {
        state.log = log;
    }
};

const actions = {
    getAllLogs({commit}) {
        LogsApi.getAll().then(logs => commit('GET_ALL', logs));
    },

    getLogById({commit}, id) {
        LogsApi.getById(id).then(log => commit('GET_LOG', log));
    }
};

const getters = {
    allLogs(state) {
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