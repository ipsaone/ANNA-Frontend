import axios from 'axios';
import FormData from 'form-data';
import base from '@/api/url';
import store from '@/store';

const url = base + '/storage/';

export default {
    getFolder(id) {
        return axios.get(url + 'files/list/' + id, {withCredentials: true});
    },

    downloadFile(id) {
        return axios.get(url + 'files/' + id + '?download=true', {withCredentials: true});
    },

    uploadFile(file) {
        let form = new FormData();
        form.append('file', file);
        form.append('name', file.name);
        form.append('dirId', store.getters.folder.id);
        form.append('groupId', 1);
        form.append('ownerId', 1);
        form.append('allRead', 1);
        form.append('allWrite', 1);
        form.append('GroupRead', 1);
        form.append('GroupWrite', 1);
        form.append('ownerWrite', 1);
        form.append('ownerRead', 1);

        axios.post(url + 'upload/', form)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
};