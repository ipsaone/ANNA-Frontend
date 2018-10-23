import MissionsApi from '@/modules/missions/missions_api';

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
    },
};

const actions = {
    async retrieveMissions({commit, dispatch, state}, force = false) {
        if (state.missions.length === 0 || force) {
            let missions = await MissionsApi.getAll();
            await dispatch('setLeaders', missions.data);
            await commit('SET_ALL_MISSIONS', missions.data);
            
            if(missions.data.length == 0) {
                await commit('SET_SELECTED', {});
            }
        }
        else {
            return Promise.resolve();
        }
    },

    async retrieveMission({dispatch, commit, state}, mission_id) {
        if (!mission_id) {
            mission_id = state.selected.id;
        }
        let mission = await MissionsApi.get(mission_id);
        await commit('SET_SELECTED', mission.data);
        await dispatch('setLeader', mission.data);
        return mission;
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
            .then(() => dispatch('retrieveMissions', true));
    },

    updateMission({dispatch}, mission) {
        return MissionsApi.update(mission)
            .then(() => dispatch('retrieveMissions', true));
    },

    deleteMission({dispatch}, id) {
        return MissionsApi.delete(id)
            .then(_ => dispatch('retrieveMissions', true));
    },

    async addMissionMember({dispatch, state}, user_id) {
        let data = await MissionsApi.addMember(state.selected.id, user_id);
        await dispatch('retrieveMission', state.selected.id);
        return data;
    },

    async remMissionMember({dispatch, state}, user_id) {
        let data = await MissionsApi.remMember(state.selected.id, user_id);
        await dispatch('retrieveMission', state.selected.id);
        return data;
    },

    async updateTask({dispatch}, data) {
        let task = await MissionsApi.updateTask(data);
        await dispatch('retrieveMission');
        return task;
    },

    async storeTask({dispatch}, data) {
        await MissionsApi.saveTask(data);
        await dispatch('retrieveMission');
    },

    deleteTask({dispatch}, data) {
        return MissionsApi.deleteTask(data)
            .then(_ => dispatch('retrieveMission'));
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
