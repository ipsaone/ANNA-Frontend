import axios from 'axios';
import base from '@/api/url';

const url = base + '/auth';

const test_credentials = {username: 'foo', password: 'secret'};

export default {
    log(credentials) {
        return new Promise((resolve, reject) => {
            if (credentials.username === test_credentials.username && credentials.password === test_credentials.password) {
                resolve({data: {id: 0, username: 'foo'}});
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
    }
};