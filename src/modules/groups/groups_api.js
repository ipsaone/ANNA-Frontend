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
    async update(group) {
        return axios.put(url + group.id, {name: group.name}, {withCredentials: true});
    },
    async getGroup(id) {
        return axios.get(url + id, {withCredentials: true});
    },
    async addMember(group_id, user_id) {
        return axios.put(base + '/users/' + user_id + '/group/' + group_id,null, {withCredentials: true});
    },
    async remMember(group_id, user_id) {
        return axios.delete(base + '/users/' + user_id + '/group/' + group_id, {withCredentials: true});
    }
};
