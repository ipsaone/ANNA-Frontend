import axios from 'axios';
import base from '@/modules/url';

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
    },

    delete(user_id) {
        return axios.delete(url + user_id, {withCredentials: true});
    },

    edit(user_id, user) {
        return axios.put(url + user_id, user, {withCredentials: true});
    }
};
