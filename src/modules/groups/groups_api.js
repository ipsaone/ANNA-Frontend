import axios from 'axios';
import base from '@/modules/url';

const url = base + '/groups/';

export default {
    async getAll() {
        return axios.get(url, {withCredentials: true});
    },
    async delete(id) {
        return axios.delete(url + id, {withCredentials: true});
    },
    async save(group) {
        return axios.post(url, group, {withCredentials: true});
    },
    async update(id) {
        return axios.put(url + id, group, {withCredentials: true});
    }
};
