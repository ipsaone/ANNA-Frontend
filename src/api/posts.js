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

    save(post) {
        return axios.post(url, post);
    },

    update(post) {
        console.log(url + post.id);
        console.log(post);
        return axios.put(url + post.id, post);
    }

};

export default PostsApi;