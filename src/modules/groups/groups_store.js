import GroupsApi from '@/modules/groups/groups_api';

const state = {
    groups: [],
    selected: {}
};

const mutations = {
    SET_ALL_GROUPS (state, groups) {
        state.groups = groups;
    },

    SET_SELECTED_GROUP(state, group) {
        state.selected = group;
    },

    CLEAR_GROUP(state) {
        state.selected = {};
    }
};

const actions = {
    async retrieveGroups({commit, state}, force = false) {
        if (state.groups.length === 0 || force) { // If no groups are loaded
            let groups = await GroupsApi.getAll();
            commit('SET_ALL_GROUPS', groups.data);
            return groups.data;
        }
    },

    async retrieveGroup({commit, state}, id) {
        let group = await GroupsApi.getGroup(id);
        commit('SET_SELECTED_GROUP', group.data);
        return group.data;
    },

    async storeGroup({dispatch}, group) {
        await GroupsApi.save(group);
        dispatch('retrieveGroups', true);
    },

    async updateGroup({dispatch}, group) {
        await GroupsApi.update(group);
        dispatch('retrieveGroups', true);
    },

    async deleteGroup({dispatch}, id) {
        await GroupsApi.delete(id);
        dispatch('retrieveGroups', true);
    },

    async getGroup({dispatch, state}, id) {
        return GroupsApi.getGroup(id);
    },

    async addGroupMember({dispatch, state}, user_id) {
        let data = await GroupsApi.addMember(state.selected.id, user_id);
        await dispatch('retrieveGroup', state.selected.id);
        return data;
    },

    async remGroupMember({dispatch, state}, user_id) {
        let data = await GroupsApi.remMember(state.selected.id, user_id);
        await dispatch('retrieveGroup', state.selected.id);
        return data;
    }
};

const getters = {
    groups(state) {
        return state.groups;
    },

    selectedGroup(state) {
        return state.selected;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
