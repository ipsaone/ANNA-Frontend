import axios from 'axios';
import FormData from 'form-data';
import base from '@/api/url';

const url = base + '/storage/';

export default {
    getFolder(id) {
        return axios.get(url + 'files/list/' + id, {withCredentials: true});
    },

    downloadFile(id) {
        return axios.get(url + 'files/' + id + '?download=true', {withCredentials: true});
    },

    uploadFile(data) {
        let form = new FormData();

        form.append('contents', data.contents);
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

        return axios.post(url + 'upload/', form, {withCredentials: true});
    }
};