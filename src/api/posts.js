import axios from 'axios';
import base from '@/api/url';

const url = base + '/posts/';

const PostsApi = {
    getPublished() {
        return axios.get(url + '?published=true');
    },

    getDrafted() {
        return axios.get(url + '?published=false');
    },

    store(post) {
        return axios.post(url, post);
    }

};

export default PostsApi;