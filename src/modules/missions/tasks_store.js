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
        dispatch('retrieveTasks', {force: true, missionId: data.missionId});
        return task;
    },

    storeTask({dispatch}, data) {
        return TasksApi.save(data)
            .then(_ => dispatch('retrieveTasks', {force: true, missionId: task.missionId}));
    },

    deleteTasks({dispatch}, id) {
        return TasksApi.delete(id)
            .then(_ => dispatch('retrieveTasks', true));
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
