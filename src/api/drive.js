import axios from 'axios';

const url = 'https://one.ipsa.fr/backend/storage';

const DriveApi = {
    getList() {
        return axios.get(url);
    },

    getLatestDataById(id) {

    },

    getAllDataById(id) {

    },

    addDataById(id) {

    },

    deleteFileById(id) {

    },

    downloadFileById(id) {

    },

    


};

export default PostsApi;