import UsersApi from '@/api/test/users';

const state = {
    users: [],
    user: {}
};

const mutations = {
    GET_ALL(state, users) {
        state.users = users;
    },

    GET_USER(state, user) {
        state.user = user;
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
            commit('GET_ALL', users);
        });
    },

    getUser({commit}, id) {
        UsersApi.getUserById(id).then(user => {
            commit('GET_USER', user);
        });
    },

    addUser({commit}, user) {
        UsersApi.postUser(user).then(_ => {
            commit('ADD_USER', user);
        });
    },
};

const getters = {
    allUsers(state) {
        return state.users;
    },

    usersNumber(state) {
        return this.allUsers(state).length;
    },

    selectedUser(state) {
        return state.user;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};