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
            if (res.data.logged === true) {
                return true;
            }

            return false;
        } catch(err) {
            return false;
        }
    },

    async checkUserState() {
        let isUserLogged = await this.check();
        return isUserLogged;
    }
};
