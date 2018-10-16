import GroupsApi from '@/modules/groups/groups_api';

const state = {
    groups: []
};

const mutations = {
    SET_ALL_GROUPS (state, groups) {
        state.groups = groups;
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

    storeGroup({dispatch}, group) {
        return GroupsApi.save(group)
            .then(() => dispatch('retrieveGroups', true));
    },

    updateGroup({dispatch}, group) {
        return GroupsApi.update(group)
            .then(() => dispatch('retrieveGroups', true));
    },

    deleteGroup({dispatch}, id) {
        return GroupsApi.delete(id)
            .then(() => dispatch('retrieveGroups', true));
    },

    getGroup({dispatch, state}, id) {
        return GroupsApi.getGroup(id);
    }
};

const getters = {
    groups(state) {
        return state.groups;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
