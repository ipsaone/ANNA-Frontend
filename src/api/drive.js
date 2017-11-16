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

    uploadFile(file) {
        let form = new FormData();
        form.append('file', file, file.name);
        form.append('name', file.name);
        form.append('ownerId', 1);

        axios.post(url + 'upload/', form)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
};