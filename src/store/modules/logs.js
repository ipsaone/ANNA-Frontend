import LogsApi from '@/api/test/logs';

const state = {
    logs: []
};

const mutations = {
    SET_ALL_LOGS(state, logs) {
        state.logs = logs;
    }
};

const actions = {
    retrieveLogs({commit, state}, force = false) {
        return new Promise((resolve, reject) => {
            if (state.logs.length === 0 || force) {
                LogsApi.getAll()
                    .then(logs => {
                        commit('SET_ALL_LOGS', logs);
                        resolve();
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve();
            }
        });
    }
};

const getters = {
    logs(state) {
        return state.logs;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};