import UsersApi from '@/modules/users/users_api';

const state = {
    users: [],
    user: {}
};

const mutations = {
    SET_ALL_USERS(state, users) {
        state.users = users;
    },

    SELECT_USER(state, user) {
        state.user = user;
    }
};

const actions = {
    retrieveUsers({commit, state}, force = false) {
        if (state.users.length === 0 || force) {
            return UsersApi.getAll().then(users => commit('SET_ALL_USERS', users.data));
        }
        else {
            return Promise.resolve();
        }
    },

    selectUser({state, commit, dispatch}, id) {
        return dispatch('retrieveUsers')
            .then(_ => {
                const user = state.users.filter(user => user.id === parseInt(id))[0];

                if (typeof user !== 'undefined') commit('SELECT_USER', user);
                else throw Error;
            });
    },

    getUserById({state, dispatch}, id) {
        return dispatch('retrieveUsers')
            .then(_ => {
                const user = state.users.filter(user => user.id === parseInt(id))[0];

                if (typeof user !== 'undefined') return user;
                else throw Error;
            });
    },

    insertUser({state, commit, dispatch}, user) {
        if (user.username && user.email && user.password) {
            return UsersApi.add(user)
                .then(() => dispatch('retrieveUsers', true));
        }
    },

    deleteUser({state, commit, dispatch}, id) {
        return UsersApi.delete(id)
            .then(() => dispatch('retrieveUsers', true));
    }
};

const getters = {
    users(state) {
        return state.users;
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
