import AuthApi from '@/modules/auth/auth_api';
import UsersApi from '@/modules/users/users_api';

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
            if(user.groups) {
                user.groups.forEach(group => {
                    state.groups.push(group.name);
                });
            }
            if(user.participatingMissions) {
                user.participatingMissions.forEach(mission => {
                    state.missions.push(mission.id);
                });
            }
            if(user.leaderMissions) {
                user.leaderMissions.forEach(mission => {
                    state.missions.push(mission.id);
                });
            }
            if(user.events) {
                user.events.forEach(event => {
                    state.events.push(event.id);
                });
            }
        }
    },
    IS_USER_LOGGED(state, data){
        if (data != true){
            state.logged = {};
        }
    },
    CLEAR_LOGIN(state) {
        state.logged = {};
        state.groups = [];
        state.events = [];
        state.missions = [];
    }
};

const actions = {
    async loginUser({commit}, credentials) {
        let res = await AuthApi.log(credentials);
        commit('SET_LOGGED_USER', res.data);
    },

    async logoutUser({commit}) {
        localStorage.clear();
        await AuthApi.logout();
        commit('SET_LOGGED_USER', {});
    },

    async retrieveLoggedUser({commit, state}) {
        let res = await UsersApi.get(state.logged.id);
        commit('SET_LOGGED_USER', res.data);
    },

    async checkLoggedUser({commit, state, credentials}){
        let res = await AuthApi.checkUserState();
        commit('IS_USER_LOGGED', res);
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
        return state.groups.includes('authors');
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
