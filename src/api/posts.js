import axios from 'axios';
import base from '@/api/url';

const url = base + '/posts/';

const PostsApi = {
    getAll() {
        console.log('API Post called - getAll()');
        return axios.get(url);
    }
};

export default PostsApi;