import axios from 'axios';
import base from '@/api/url';

const url = base + '/events/';

export default {
    getAll() {
        return axios.get(url, {withCredentials: true});
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
        return axios.put(url + event_id + '/register/' + user_id, {withCredentials: true});
    },

    withdraw(event_id, user_id) {
        return axios.delete(url + event_id + '/register/' + user_id, {withCredentials: true});
    }
};