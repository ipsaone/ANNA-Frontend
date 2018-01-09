import AuthApi from '@/api/auth';
import UsersApi from '@/api/users';

const state = {
    logged: {},
    groups: [],
    events: [],
    missions: []
};

const mutations = {
    SET_LOGGED_USER(state, user) {
        state.groups = [];
        state.missions = [];
        state.events = [];

        if (typeof user.id === 'undefined') {
            state.logged = {};
            state.groups = [];
            state.missions = [];
            state.events = [];
        }
        else {
            state.logged = user;
            user.groups.forEach(group => {
                state.groups.push(group.name);
            });
            user.participatingMissions.forEach(mission => {
                state.missions.push(mission.id);
            });
            user.events.forEach(event => {
                state.events.push(event.id);
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
    },

    retrieveLoggedUser({commit, state}) {
        return UsersApi.get(state.logged.id).then(res => commit('SET_LOGGED_USER', res.data));
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
    },

    loggedUserMissions(state) {
        return state.missions;
    },

    loggedUserEvents(state) {
        return state.events;
    },
};

export default {
    state,
    mutations,
    actions,
    getters
};