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
    retrieveGroups({commit, state}, force = false) {
        if (state.groups.length === 0 || force) { // If no groups are loaded
            return GroupsApi.getAll().then(groups => commit('SET_ALL_GROUPS', groups.data));
        }
        else {
            Promise.resolve();
        }
    },

    storeGroup({dispatch}, name) {
        return GroupsApi.save(name)
            .then(() => dispatch('retrieveGroups', true));
    },

    updateGroup({dispatch}, group) {
        return GroupsApi.update(group)
            .then(() => dispatch('retrieveGroups', true));
    },

    deleteEvent({dispatch}, id) {
        return GroupsApi.delete(id)
            .then(() => dispatch('retrieveGroups', true));
    },
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
