import axios from 'axios';
import base from '@/modules/url';


export default {
    getAll(missionId) {
        return axios.get(base + '/missions/' + missionId + '/tasks', {withCredentials: true});
    },

    save(data) {
        return axios.post(base +'/missions/' + data.missionId + '/tasks', data.task, {withCredentials: true});
    },

    update(data) {
        return axios.put(base + '/missions/' + data.missionId + '/task/' + data.task.id, data.task, {withCredentials: true});
    },

    delete(id) {
        return axios.delete(base + '/missions/' + task.missionId + '/task/' + id, {withCredentials: true});
    }
};