import TasksApi from './tasks_api';

const state = {
    tasks: []
};

const mutations = {
    SET_ALL_TASKS(state, tasks) {
        state.tasks = tasks;
    }
};

const actions = {
    retrieveTasks({commit, state}, data) {
        if (state.tasks.length === 0 || data.force) {
            return TasksApi.getAll(data.missionId)
                .then(tasks => commit('SET_ALL_TASKS', tasks.data));
        }
        else {
            return Promise.resolve();
        }
    },

    async updateTask({dispatch}, data) {
        let task = await TasksApi.update(data);
        await dispatch('retrieveTasks', {force: true, missionId: data.missionId});
        return task;
    },

    async storeTask({dispatch}, data) {
        await TasksApi.save(data);
        await dispatch('retrieveTasks', {force: true, missionId: data.missionId});
    },

    deleteTasks({dispatch}, data) {
        return TasksApi.delete(data.id)
            .then(_ => dispatch('retrieveTasks', {force: true, missionId: data.missionId}));
    }
};

const getters = {
    tasks(state) {
        return state.tasks;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
