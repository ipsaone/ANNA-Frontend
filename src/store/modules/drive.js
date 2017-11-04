import DriveApi from '@/api/drive';

const state = {
    folder: {},
    selected: {}
};

const mutations = {
    SET_FOLDER(state, folder) {
        state.folder = folder;
    },

    SET_SELECTED(state, file) {
        state.selected = file;
    }
};

const actions = {
    retrieveFolder({commit, dispatch}, id) {
        return new Promise((resolve, reject) => {
            DriveApi.getFolder(id)
                .then(folder => dispatch('setOwners', folder.data))
                .then(folder => commit('SET_FOLDER', folder))
                .then(_ => resolve())
                .catch(err => reject(err));
        });
    },

    selectFile({commit}, file) {
        return new Promise(resolve => {
            commit('SET_SELECTED', file);
            resolve();
        });
    },

    setOwners({state, dispatch}, folder) {
        return dispatch('getUserById', folder.ownerId)
            .then(user => {
                folder.owner = user;
            })
            .then(_ => {
                folder.children.forEach(child => {
                    dispatch('getUserById', child.ownerId)
                        .then(user => {
                            child.owner = user;
                        });
                });
            })
            .then(_ => { return folder; })
            .catch(err => {
                console.log(err);
            });
    }
};

const getters = {
    folder(state) {
        return state.folder;
    },

    content(state) {
        return state.folder.children;
    },

    selectedFile(state) {
        return state.selected;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};