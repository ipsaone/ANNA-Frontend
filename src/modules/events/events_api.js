import axios from 'axios';
import base from '@/modules/url';

const url = base + '/events/';

export default {
    getAll() {
        return axios.get(url, {withCredentials: true});
    },

    get(id) {
        return axios.get(url + id, {withCredentials: true});
    },

    save(event) {
        return axios.post(url, event, {withCredentials: true});
    },

    update(event) {
        return axios.put(url + event.id, event, {withCredentials: true});
    },

    delete(id) {
        return axios.delete(url + id, {withCredentials: true});
    },

    register(event_id, user_id) {
        return axios.put(url + event_id + '/register/' + user_id, null, {withCredentials: true});
    },

    withdraw(event_id, user_id) {
        return axios.delete(url + event_id + '/register/' + user_id, {withCredentials: true});
    }
};