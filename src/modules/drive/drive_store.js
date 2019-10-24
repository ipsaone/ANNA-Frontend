import DriveApi from '@/modules/drive/drive_api';

const state = {
    // DRIVE V1
    folder: {},
    selected: {},
    percentCompleted: 0,
    searchResults : [],
    searchKeyWord : '',
    showHistory: false,
    meta: [],

    // DRIVE V2
        // each folder is {type: 'folder', meta: {}, children: []}
        // each file is {type: 'file', meta: {}}
    fileTree: {},
    curFolder: 0
};

const mutations = {
    // DRIVE V1
    SET_FOLDER(state, folder) {
        state.folder = folder;
    },
    SET_SELECTED(state, file) {
        state.selected = file;
    },
    CLEAR_DRIVE(state) {
        state.selected = {};
    },
    UPDATE_PROGRESS(state, progress) {
        state.percentCompleted = progress;
    },
    SET_RESULT(state, result) {
        state.searchResults = result;
    },
    SET_KEYWORD(state, keyWord) {
        state.searchKeyWord = keyWord;
    },

    SHOW_HISTORY(state) {
        state.showHistory = true;
    },

    HIDE_HISTORY(state) {
        state.showHistory = false;
    },

    SET_META(state, data) {
        state.meta = data;
    },

    // DRIVE V2
    SET_FOLDER_V2(state, folderId) {
        state.curFolder = folderId;
    },
    INSERT_FOLDER_V2(state, parentPath, child) {

    },
    REMOVE_FOLDER_V2(state, parentPath, childId) {

    },
    INSERT_FILE_META_V2(state, parentPath, meta) {

    }

};

const actions = {
    // DRIVE V1
    async retrieveFolder({commit, dispatch}, id, force=true) {
        let folder = await DriveApi.getFolder(id);
        await dispatch('setFolderOwners', folder.data);
        commit('SET_FOLDER', folder.data);
        await dispatch('unselectFile');
    },

    selectFile({commit}, file) {
        return new Promise(resolve => {
            commit('SET_SELECTED', file);
            resolve();
        });
    },

    async updateProgress({commit, dispatch}, progress) {
        return new Promise(resolve => {
            commit('UPDATE_PROGRESS', progress);
            resolve();
        });
    },

    resetProgress({commit, dispatch}) {
        commit('UPDATE_PROGRESS', 0);
    },

    unselectFile({commit}) {
        return new Promise(resolve => {
            commit('SET_SELECTED', {});
            resolve();
        });
    },

    async setFolderOwners({dispatch}, folder) {

        let user = await dispatch('getUserById', folder.ownerId);
        folder.owner = user;

        let promises = [];
        folder.children.forEach(child => {
            promises.push(dispatch('getUserById', child.ownerId).then(user => {child.owner = user;}));
        });

        await Promise.all(promises);

        return folder;
    },

    async setSearchOwners({dispatch}, searchResults) {
        let promises  = [];
        searchResults.forEach(result => {
            promises.push(dispatch('getUserById', result.ownerId).then(user => {result.owner = user;}));
        });

        await Promise.all(promises);

        return true;
    },

    async getFoldersList({dispatch}, folderId) {
        let res = await DriveApi.getFoldersList(folderId);
        return res.data;
    },

    async search ({dispatch, commit}, searchPara) {
        let result = await DriveApi.search(searchPara.keywords, searchPara.types);
        await dispatch('setSearchOwners', result.data);
        commit('SET_RESULT', result.data);
    },

    async showHistory({dispatch, commit}, fileId) {
        let res = await DriveApi.getMeta(fileId);
        commit('SET_META', res.data);
        commit('SHOW_HISTORY');
    },

    async hideHistory({dispatch, commit}) {
        commit('HIDE_HISTORY');
    },


    // DRIVE V2

    // folderPath : path to folder using IDs [folderId, folderId, folderId]
    async loadMeta_v2({dispatch, commit}, folderPath, fileId) {
        // call API to get data
        //
    },
    async loadFolder_v2({dispatch, commit}, folderPath, preload=false) {
        // load children list
        // for each children :
            // load meta
        // if preload:
            // preload folder
    },
    async preload_v2({dispatch, commit}, folderPath) {
        // for each child folder:
            // loadFolder, preload=false
    }
};

const getters = {
    // DRIVE V1
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

    progress(state) {
        return state.percentCompleted;
    },

    searchResultsContent(state) {
        return state.searchResults;
    },

    keyWord(state) {
        return state.searchKeyWord;
    },

    showHistory(state) {
        return state.showHistory;
    },

    metaData(state) {
        return state.meta;
    },

    // DRIVE V2
    curFolder_v2(state) {
        return state.curFolder;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
