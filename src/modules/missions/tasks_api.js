import axios from 'axios';
import base from '@/modules/url';

const url = base + '/tasks/';

export default {
    getAll() {
        return axios.get(url, {withCredentials: true});
    },

    save(task) {
        return axios.post(url, task, {withCredentials: true});
    },

    update(task) {
        return axios.put(base + '/missions/' + task.missionId + '/task/' + task.id, task, {withCredentials: true});
    },

    delete(id) {
        return axios.delete(url + id, {withCredentials: true});
    }
};