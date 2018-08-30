import axios from 'axios';
import base from '@/modules/url';

const url = base + '/groups/';

export default {
    getAll() {
        return axios.get(url, {withCredentials: true});
    },
    deleteGroup(id) {
        return axios.delete(url + id, {withCredentials: true});
    },
    addGroup(group){
        return axios.post(url + id, group, {withCredentials: true});
    }
};
