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
    async retrieveUsers({commit, state}, force = false) {
        if (state.users.length === 0 || force) {
            let users = await UsersApi.getAll();
            commit('SET_ALL_USERS', users.data);
        }
    },

    async selectUser({state, commit, dispatch}, id) {
        let user = await UsersApi.get(id);
        commit('SELECT_USER', user.data);
        return;
    },

    async getUserById({state}, id) {
        let user = state.users.filter(us => us.id == id)[0];
        if(!user) {
            let res = await UsersApi.get(id);
            user = res.data;
        }
        return user;
    },

    async insertUser({state, commit, dispatch}, user) {
        if (user.username && user.email && user.password) {
            await UsersApi.add(user);
            await dispatch('retrieveUsers', true);
        }
    },

    async deleteUser({state, commit, dispatch}, id) {
        await UsersApi.delete(id);
        await dispatch('retrieveUsers', true);
    },

    async editUser({dispatch}, data) {
        await UsersApi.edit(data.id, data.user);
        await dispatch('retrieveUsers', true);
    }
};

const getters = {
    users(state) {
        return state.users;
    },

    selectedUser(state) {
        return state.user;
    },
    userGroups(state) {
        return state.user.groups;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
