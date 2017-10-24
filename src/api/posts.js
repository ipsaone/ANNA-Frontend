import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/posts/';

const PostsApi = {
    getAll() {
        return axios.get(url);
    },

    getPostById(id) {
        return axios.get(url + id);
    },

    postPost(post) {
        return axios.post(url, post);
    },

    updatePost(post) {
        return axios.put(url + post.id, post);
    },

    deletePost(post) {
        return axios.delete(url + post.id);
    }
};

export default PostsApi;