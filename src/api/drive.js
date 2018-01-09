import axios from 'axios';
import FormData from 'form-data';
import base from '@/api/url';

const url = base + '/storage/';

const config = {
    onUploadProgress: progressEvent => {
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        // do whatever you like with the percentage complete
        // maybe dispatch an action that will update a progress bar or something
    },
    withCredentials: true
};

export default {
    getFolder(id) {
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

        return axios.post(url + 'upload/', form, config);
    },

    editFile(data) {
        
    }
};