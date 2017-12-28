import AuthApi from '@/api/auth';

const state = {
    logged: {},
    groups: []
};

const mutations = {
    SET_LOGGED_USER(state, user) {
        state.logged = user;
        user.groups.forEach(group => {
            state.groups.push(group.name);
        });
    },
};

const actions = {
    loginUser({commit}, credentials) {
        return new Promise((resolve, reject) => {
            AuthApi.log(credentials)
                .then(res => {
                    commit('SET_LOGGED_USER', res.data);
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    logoutUser({commit}) {
        return new Promise(resolve => {
            AuthApi.logout()
                .then(_ => {
                    commit('SET_LOGGED_USER', {});
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
};

const getters = {
    loggedUser(state) {
        return state.logged;
    },

    loggedUserId(state) {
        return state.logged.id;
    },

    isLogged(state) {
        return state.logged.id !== undefined && state.logged.username !== undefined;
    },

    loggedUserGroups(state) {
        return state.groups;
    },

    loggedUserIsRoot(state) {
        return state.groups.includes('root');
    },

    loggedUserIsAuthor(state) {
        return state.groups.includes('author');
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};