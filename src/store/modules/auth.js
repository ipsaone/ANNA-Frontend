import AuthApi from '@/api/auth';

const state = {
    logged: {},
    groups: []
};

const mutations = {
    SET_LOGGED_USER(state, user) {
        if (typeof user.id === 'undefined') {
            state.logged = {};
            state.groups = [];
        }
        else {
            state.logged = user;
            user.groups.forEach(group => {
                state.groups.push(group.name);
            });
        }
    },
};

const actions = {
    loginUser({commit}, credentials) {
        return AuthApi.log(credentials).then(res => commit('SET_LOGGED_USER', res.data));
    },

    logoutUser({commit}) {
        return AuthApi.logout().then(_ => commit('SET_LOGGED_USER', {}));
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