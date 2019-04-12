import axios from 'axios';
import FormData from 'form-data';
import base from '@/modules/url';
import store from '@/modules/store';

const url = base + '/storage/';

const config = {
    onUploadProgress: progressEvent => {
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        //console.log(percentCompleted, 'mabite');
        // do whatever you like with the percentage complete
        // maybe dispatch an action that will update a progress bar or something
        store.dispatch('updateProgress', percentCompleted);
    },
    withCredentials: true
};

export default {
    getConfig() {
        return config;
    },
    async getFolder(id) {
        return axios.get(url + 'files/list/' + id, {withCredentials: true});
    },

    downloadFile(id) {
        window.open(url + 'files/' + id + '?download=true');
    },

    uploadFile(data) {
        let form = new FormData();

        if (data.contents !== undefined) {
            form.append('contents', data.contents);
        }

        form.append('name', data.name);
        form.append('isDir', (data.isDir) ? data.isDir : false);
        form.append('dirId', data.dirId);
        form.append('groupId', data.groupId);
        form.append('ownerId', data.ownerId);
        form.append('allRead', data.allRead);
        form.append('allWrite', data.allWrite);
        form.append('groupRead', data.groupRead);
        form.append('groupWrite', data.groupWrite);
        form.append('ownerWrite', data.ownerWrite);
        form.append('ownerRead', data.ownerRead);

        console.log('salut salut', config.onUploadProgress.percentCompleted);
        return axios.post(url + 'upload', form, config);
    },

    editFile(edit) {
        let form = new FormData();

        let data = edit.data;

        if (data.contents !== undefined) form.append('contents', data.contents);
        if (data.name !== undefined) form.append('name', data.name);
        if (data.isDir !== undefined) form.append('isDir', (data.isDir) ? data.isDir : false);
        if (data.dirId !== undefined) form.append('dirId', data.dirId);
        if (data.groupId !== undefined) form.append('groupId', data.groupId);
        if (data.ownerId !== undefined) form.append('ownerId', data.ownerId);
        if (data.allRead !== undefined) form.append('allRead', data.allRead);
        if (data.allWrite !== undefined) form.append('allWrite', data.allWrite);
        if (data.groupRead !== undefined) form.append('groupRead', data.groupRead);
        if (data.groupWrite !== undefined) form.append('groupWrite', data.groupWrite);
        if (data.ownerWrite !== undefined) form.append('ownerWrite', data.ownerWrite);
        if (data.ownerRead !== undefined) form.append('ownerRead', data.ownerRead);

        return axios.put(url + 'upload/' + edit.fileId, form, config);
    },

    deleteFile(fileId) {
        return axios.delete(url + 'files/' + fileId, {withCredentials: true});
    },

    async getFoldersList(folderId) {
        return axios.get(url + 'files/list/'+folderId+'?foldersOnly=true', {withCredentials: true});;
    }
};
