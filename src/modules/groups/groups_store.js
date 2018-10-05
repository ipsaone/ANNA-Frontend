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
        console.log('here');
        if (state.groups.length === 0 || force) { // If no groups are loaded
            let groups = await GroupsApi.getAll();
            commit('SET_ALL_GROUPS', groups.data);
            console.log(groups);
            return groups;
        }
        else {
            console.log('NOT IN');
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
