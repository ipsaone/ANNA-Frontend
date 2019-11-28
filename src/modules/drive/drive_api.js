import axios from 'axios';
import FormData from 'form-data';
import base from '@/modules/url';
import store from '@/modules/store';

const url = base + '/storage/';

let CancelToken = axios.CancelToken;
var cancelCall = CancelToken.source();

const config = {
    onUploadProgress: progressEvent => {
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
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
    search(str, searchTypes) {
        let request = {
            keyword: str,
            upperFolder: store.getters.folder.fileId,
            include: searchTypes,
        };
        return axios.post(url + 'files/search', request, {withCredentials: true});
    },

    downloadFile(id) {
        window.open(url + 'files/' + id);
    },

    downloadRev(fileId, dataId) {
        window.open(url + 'files/' + fileId + '?data=' + dataId);
    },

    getMeta(id) {
        return axios.get(url + 'files/' + id + '/meta', {withCredentials: true});
    },


    async uploadFile(data) {
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
        form.append('serialNbr', data.serialNbr);

        return axios.post(url + 'upload', form, {
            ...config,
            cancelToken: cancelCall.token
        });
    },

    async cancelUpload(){
        cancelCall.cancel();
        CancelToken = axios.CancelToken;
        cancelCall = CancelToken.source();
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
        if (data.serialNbr !== undefined) form.append('serialNbr', data.serialNbr);

        return axios.put(url + 'upload/' + edit.fileId, form, {
            ...config,
            cancelToken: cancelCall.token
        });
    },

    deleteFile(fileId) {
        return axios.delete(url + 'files/' + fileId, {withCredentials: true});
    },

    async getFoldersList(folderId) {
        return axios.get(url + 'files/list/'+folderId+'?foldersOnly=true', {withCredentials: true});
    }
};
