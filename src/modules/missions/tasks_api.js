import axios from 'axios';
import base from '@/modules/url';


export default {
    getAll(missionId) {
        return axios.get(base + '/missions/' + missionId + '/tasks/', {withCredentials: true});
    },

    save(task) {
        return axios.post(base + '/missions/' + task.missionId + '/tasks/', task, {withCredentials: true});
    },

    update(task) {
        return axios.put(base + '/missions/' + task.missionId + '/tasks/' + task.id, task, {withCredentials: true});
    },

    delete(id) {
        return axios.delete(base + '/missions/' + task.missionId + '/tasks/' + id, {withCredentials: true});
    }
};