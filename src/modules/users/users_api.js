import axios from 'axios';
import base from '@/modules/url';

const url = base + '/users/';

export default {
    async getAll() {
        return axios.get(url, {withCredentials: true});
    },

    async get(user_id) {
        return axios.get(url + user_id, {withCredentials: true});
    },

    async add(user) {
        return axios.post(url, user, {withCredentials: true});
    },

    async delete(user_id) {
        return axios.delete(url + user_id, {withCredentials: true});
    },

    async edit(user_id, user) {
        return axios.put(url + user_id, user, {withCredentials: true});
    }
};
