import axios from 'axios';
import base from '@/modules/url';

const url = base + '/missions/';

export default {
    getAll() {
        return axios.get(url, {withCredentials: true});
    },

    get(mission_id) {
        return axios.get(url + mission_id, {withCredentials: true});
    },

    save(mission) {
        return axios.post(url, mission, {withCredentials: true});
    },

    update(data) {
        return axios.put(url + data.id, data.mission, {withCredentials: true});
    },

    delete(id) {
        return axios.delete(url + id, {withCredentials: true});
    },

    addMember(mission_id, user_id) {
        return axios.put(url + mission_id + '/members/' + user_id, null, {withCredentials: true});
    },

    remMember(mission_id, user_id) {
        return axios.delete(url + mission_id + '/members/' + user_id, {withCredentials: true});
    },

    getAllTasks(missionId) {
        return axios.get(url + missionId + '/tasks', {withCredentials: true});
    },

    saveTask(data) {
        return axios.post(url + data.missionId + '/tasks', data.task, {withCredentials: true});
    },

    updateTask(data) {
        return axios.put(url + data.missionId + '/task/' + data.task.id, data.task, {withCredentials: true});
    },

    deleteTask(task) {
        return axios.delete(url + task.missionId + '/task/' + task.id, {withCredentials: true});
    }
};
