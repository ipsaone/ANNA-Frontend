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
    SET_LEADER(state, data) {
        let index = state.missions.map(mi => mi.id).indexOf(data.id);
        state.missions[index] = {...state.missions[index], leader: data.user};
    },
    UNSELECT_MISSION(state) {
        state.selected = {};
    }
};

const actions = {
    async retrieveMissions({commit, dispatch, state}, force = false) {
        if (state.missions.length === 0 || force) {
            let res = await MissionsApi.getAll();

            let missions = await Promise.all(res.data.map(async mi => {
                let leader = await dispatch('getUserById', mi.leaderId);
                mi = {...mi, leader: leader};
                return mi;
            }));
            await commit('SET_ALL_MISSIONS', missions);

            if(missions.length == 0) {
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
        let res = await MissionsApi.get(mission_id);
        let mission = res.data;

        let leader = await dispatch('getUserById', mission.leaderId);
        mission.leader = leader;
        await commit('SET_SELECTED', mission);
    },

    async storeMission({dispatch}, mission) {
        let res = await MissionsApi.save(mission);
        dispatch('retrieveMissions', true);
        return res;
    },

    async updateMission({dispatch, commit}, mission) {
        await MissionsApi.update(mission);
        dispatch('retrieveMissions', true);
        commit('SET_SELECTED', mission.id);
    },

    async deleteMission({dispatch}, id) {
        await MissionsApi.delete(id);
        dispatch('retrieveMissions', true);
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

    async deleteTask({dispatch}, data) {
        await MissionsApi.deleteTask(data);
        await dispatch('retrieveMission');
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
