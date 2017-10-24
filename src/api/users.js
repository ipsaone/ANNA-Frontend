import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/users/';

const UsersApi = {
    getAll() {
        return axios.get(url);
    },

    getUserById(id) {
        return axios.get(url + id);
    },

    postUser(user) {
        return axios.post(url, user);
    },

    updateUser(user) {
        return axios.put(url + user.id, user);
    },

    deleteUser(user) {
        return axios.delete(url + user.id);
    }
};

export default UsersApi;