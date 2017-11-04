import axios from 'axios';
import base from '@/api/url';

const url = base + '/storage/';

export default {
    getFolder(id) {
        return axios.get(url + 'files/list/' + id, {withCredentials: true});
    }
};