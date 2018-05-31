import axios from 'axios';
import base from '@/api/url';

const url = base + '/users/';

export default {
    getAll() {
        return axios.get(url, {withCredentials: true});
    },

    get(user_id) {
        return axios.get(url + user_id, {withCredentials: true});
    },

    add(user) {
        return axios.post(url, user, {withCredentials: true});
    }
};
