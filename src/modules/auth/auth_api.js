import axios from 'axios';
import base from '@/modules/url';

const url = base + '/auth';
const isLogged = false;

const test_credentials = {username: 'foo', password: 'secret'};

export default {
    log(credentials) {
        return new Promise((resolve, reject) => {
            if (credentials.username === test_credentials.username && credentials.password === test_credentials.password) {
                resolve({data: {id: 0, username: 'foo', groups: []}});
            }
            else {
                axios.post(url + '/login', credentials, {withCredentials: true})
                    .then(user => {
                        resolve(user);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
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
