import axios from 'axios';
import base from '@/modules/url';

const url = base + '/auth';

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

    async changePassword(user) {
        console.log(user);
        return axios.post(url + '/changePassword', 
            {oldPassword : user.old_password, newPassword1: user.password, newPassword2: user.password_conf}, 
            {withCredentials: true}
        );
    }
}

;
