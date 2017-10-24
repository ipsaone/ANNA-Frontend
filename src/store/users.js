import UsersApi from '@/api/users';

const state = {
    users: [],
    user: {}
};

const mutations = {
    GET_ALL(state, users) {
        state.users = users;
    },

    ADD_USER(state, user) {
        state.users.push(user);
    },

    UPDATE_USER(state, users) {
        state.user = users;
    },

    DELETE_USER(state, users) {
        state.users = users;
    }
};

const actions = {
    getAllUsers({commit}) {
        UsersApi.getAll().then(users => {
            commit('GET_ALL', users.data);
        });
    },

    addUser({commit}, user) {
        UsersApi.postUser(user).then(res => {
            commit('ADD_USER', user);
        });
    },

    updateUser({commit}, user) {
        UsersApi.updateUser(user).then(res => {

        });
    }
};

const getters = {
    allUsers(state) {
        return state.users;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};