import axios from 'axios';
import base from '@/modules/url';

const url = base + '/auth';
const isLogged = false;

const test_credentials = {username: 'foo', password: 'secret'};

export default {
    async log(credentials) {
        if (credentials.username === test_credentials.username && credentials.password === test_credentials.password) {
            return {data: {id: 0, username: 'foo', groups: []}};
        }
        else {
            return axios.post(url + '/login', credentials, {withCredentials: true});
        }
    },

    logout() {
        return axios.get(url + '/logout', {withCredentials: true});
    },

    async check() {
        try {
            let res = await axios.get(url + '/check', {withCredentials: true});
            return res.data.logged === true;

        } catch(err) {
            return false;
        }
    },

    async checkUserState() {
        return this.check();
    },

    async changePassword() {
        return axios.post(url + '/changePassword', {oldPassword : 'abc', newPassword1: 'def', newPassword2: 'def'});
    }
}

;
