const state = {
    statuses: [
        {
            type: 'warning',
            title: 'Test 1',
            text: 'It\'s a warning',
            duration: 1000
        },
        {
            type: 'success',
            title: 'Test 2',
            text: 'It\'s a success',
            duration: 1000
        }
    ]
};

const mutations = {
    ADD_STATUS(state, error) {
        state.statuses.push(error);
    },

    DELETE_STATUS(state, status) {
        state.statuses = state.statuses.filter(_status => _status.id !== status.id);
    },

    CLEAR_STATUSES(state) {
        state.statuses = [];
    }
};

const actions = {
    addStatus({commit}, status) {
        commit('ADD_STATUS', status);
    },

    deleteStatus({commit}, status) {
        commit('DELETE_STATUS', status);
    },

    clearStatuses({commit}) {
        commit('CLEAR_STATUSES');
    }
};

const getters = {
    statuses(state) {
        return state.statuses;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};