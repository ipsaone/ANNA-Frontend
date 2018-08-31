import axios from 'axios';
import base from '@/modules/url';

const url = base + '/groups/';

export default {
    getAll() {
        return axios.get(url, {withCredentials: true});
    },
    delete(id) {
        return axios.delete(url + id, {withCredentials: true});
    },
    save(group) {
        return axios.post(url + id, group, {withCredentials: true});
    },
    update(id) {
        return axios.put(url + id, group, {withCredentials: true});
    }
};
