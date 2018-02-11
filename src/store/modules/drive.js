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
        return DriveApi.getFolder(id)
            .then(folder => dispatch('setOwners', folder.data))
            .then(folder => commit('SET_FOLDER', folder))
            .then(dispatch('unselectFile'));
    },

    selectFile({commit}, file) {
        return new Promise(resolve => {
            commit('SET_SELECTED', file);
            resolve();
        });
    },

    unselectFile({commit}) {
        return new Promise(resolve => {
            commit('SET_SELECTED', {});
            resolve();
        });
    },

    setOwners({dispatch}, folder) {
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
            .then(_ => {
                return folder;
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