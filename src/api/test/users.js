const _users = [
    {id: 1, username: 'foo', email: 'foo@local.dev'},
    {id: 2, username: 'bar', email: 'bar@local.dev'},
    {id: 3, username: 'J@nh', email: 'test@local.dev'}
];

export default {
    getAll() {
        return new Promise(resolve => {
            resolve(_users);
        });
    },

    getUserById(id) {
        return new Promise(resolve => {
            resolve(_users.id === id);
        });
    },

    postUser(user) {
        return new Promise(resolve => {
            resolve(_users.push(user));
        });
    },

    updateUser(user) {
        return new Promise(resolve => {
            for (let i in _users) {
                if (_users[i].id === user.id) {
                    resolve(_users[i] = user);
                    break;
                }
            }
        });
    },

    deleteUser(user) {
        return new Promise((resolve, reject) => {
            const i = _users.indexOf(user);
            if (i !== -1)
                resolve(_users.splice(i, 1));
            else
                reject(false);
        });
    }
};