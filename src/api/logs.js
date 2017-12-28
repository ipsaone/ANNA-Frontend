import axios from 'axios';
import base from '@/api/url';

const url = base + '/logs/';

export default {
    getAll() {
        return axios.get(url, {withCredentials: true});
    },

    save(log) {
        return axios.post(url, log, {withCredentials: true});
    },

    delete(id) {
        return axios.delete(url + id, {withCredentials: true});
    }
};