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

    update(mission) {
        return axios.put(url + mission.id, event, {withCredentials: true});
    },

    delete(id) {
        return axios.delete(url + id, {withCredentials: true});
    },

    addMember(mission_id, user_id) {
        return axios.put(url + mission_id + '/members/' + user_id, {withCredentials: true});
    },

    remMember(mission_id, user_id) {

    }
};
