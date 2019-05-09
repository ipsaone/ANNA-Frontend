import axios from 'axios';
import base from '@/modules/url';

const url = base + '/posts/';

export default {
    getPublished() {
        return axios.get(url + '?published=true', {withCredentials: true});
    },

    getDrafted() {
        return axios.get(url + '?published=false', {withCredentials: true});
    },

    save(post) {
        return axios.post(url, post, {withCredentials: true});
    },

    update(post) {
        return axios.put(url + post.id, post, {withCredentials: true});
    },

    delete(id) {
        return axios.delete(url + id, {withCredentials: true});
    }
};
