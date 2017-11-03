import UsersApi from '@/api/users';

const state = {
    users: []
};

const mutations = {
    SET_ALL_USERS(state, users) {
        state.users = users;
    }
};

const actions = {
    retrieveUsers({commit, state}, force = false) {
        return new Promise((resolve, reject) => {
            if (state.users.length === 0 || force) {
                UsersApi.getAll()
                    .then(users => {
                        commit('SET_ALL_USERS', users.data);
                        resolve();
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve();
            }
        });
    },

    getUserById({state, dispatch}, id) {
        return new Promise((resolve, reject) => {
            if (state.users.length === 0)
                dispatch('retrieveUsers', true)
                    .then(_ => {
                        const user = state.users.filter(user => user.id === parseInt(id))[0];

                        if (typeof user !== 'undefined') resolve(user);
                        else reject();
                    })
                    .catch(err => reject(err));
            else {
                const user = state.users.filter(user => user.id === parseInt(id))[0];

                if (typeof user !== 'undefined') resolve(user);
                else reject();
            }
        });
    }
};

const getters = {
    users(state) {
        return state.users;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};