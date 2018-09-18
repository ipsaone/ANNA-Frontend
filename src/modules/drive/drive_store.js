import DriveApi from '@/modules/drive/drive_api';

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
    async retrieveFolder({commit, dispatch}, id) {
        console.log('Retrieving folder : ', id);
        let folder = await DriveApi.getFolder(id);
        await dispatch('setOwners', folder.data);
        commit('SET_FOLDER', folder.data);
        await dispatch('unselectFile');
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

    async setOwners({dispatch}, folder) {
        let user = await dispatch('getUserById', folder.ownerId);
        folder.owner = user;

        let promises = [];
        folder.children.forEach(child => {
            let thisP = dispatch('getUserById', child.ownerId)
                .then(user => {child.owner = user; });
            promises.push(thisP);
        });

        return folder;
    },

    getFoldersList() {
        return DriveApi.getFoldersList();
    }
};

const getters = {
    folder(state) {
        return state.folder;
    },

    content(state) {
        if(state.folder) {
            return state.folder.children;
        }

        return {};
    },

    selectedFile(state) {
        return state.selected;
    },
};

export default {
    state,
    mutations,
    actions,
    getters
};