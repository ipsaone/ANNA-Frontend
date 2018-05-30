import MissionsApi from '@/api/missions';

const state = {
    missions: [],
    selected: {}
};

const mutations = {
    SET_ALL_MISSIONS(state, missions) {
        state.missions = missions;
    },
    SET_SELECTED(state, mission) {
        state.selected = mission;
    }
};

const actions = {
    retrieveMissions({commit, dispatch, state}, force = false) {
        if (state.missions.length === 0 || force) {
            return MissionsApi.getAll()
                .then(missions => dispatch('setLeaders', missions.data))
                .then(missions => commit('SET_ALL_MISSIONS', missions));
        }
        else {
            return Promise.resolve();
        }
    },

    retrieveMission({dispatch}, mission_id) {
        return MissionsApi.get(mission_id)
            .then(mission => dispatch('setLeader', mission.data))
            .catch(err => console.log(err));
    },

    selectMission({dispatch, commit}, mission_id) {
        return dispatch('retrieveMission', mission_id)
            .then(mission => commit('SET_SELECTED', mission));
    },

    setLeaders({dispatch}, missions) {
        return Promise.all(missions.map(mission => {
            return dispatch('getUserById', mission.leaderId)
                .then(user => {
                    mission.leader = user;
                    return mission;
                });
        }));
    },

    setLeader({dispatch}, mission) {
        return dispatch('getUserById', mission.leaderId)
            .then(user => {
                mission.leader = user;
            })
            .then(_ => {
                return mission;
            });
    },

    storeMission({dispatch}, mission) {
        return MissionsApi.save(mission)
            .then(_ => dispatch('retrieveMissions', true));
    },

    deleteMission({dispatch}, id) {
        return MissionsApi.delete(id)
            .then(_ => dispatch('retrieveMissions', true));
    }
};

const getters = {
    missions(state) {
        return state.missions;
    },

    selectedMission(state) {
        return state.selected;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};