import AuthApi from '@/api/auth';

const state = {
    logged: {}
};

const mutations = {
    SET_LOGGED_USER(state, user) {
        state.logged = user;
    },
};

const actions = {
    loginUser({commit}, credentials) {
        return new Promise((resolve, reject) => {
            AuthApi.log(credentials)
                .then(user => {
                    commit('SET_LOGGED_USER', {id: user.data.id, username: user.data.username});
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
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};