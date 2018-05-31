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
    retrieveTasks({commit, state}, force = false) {
        if (state.tasks.length === 0 || force) {
            return TasksApi.getAll()
                .then(tasks => commit('SET_ALL_TASKS', tasks));
        }
        else {
            return Promise.resolve();
        }
    },

    storeTasks({dispatch}, tasks) {
        return TasksApi.save(tasks)
            .then(_ => dispatch('retrieveTasks', true));
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