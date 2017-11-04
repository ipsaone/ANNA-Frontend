import DriveApi from '@/api/drive';

const state = {
    folder: {}
};

const mutations = {
    SET_FOLDER(state, folder) {
        state.folder = folder;
    }
};

const actions = {
    retrieveFolder({commit, state}, id, force = false) {
        return new Promise((resolve, reject) => {
            if (typeof state.folder.id === 'undefined' || force) {
                DriveApi.getFolder(id)
                    .then(folder => {
                        commit('SET_FOLDER', folder.data);
                        resolve();
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve();
            }
        });
    },
};

const getters = {
    folder(state) {
        return state.folder;
    },
    content(state) {
        return state.folder.children;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};