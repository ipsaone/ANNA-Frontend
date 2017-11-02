const _logs = [
    {
        id: 1,
        title: 'Ajout du module #5542',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum faucibus aliquet. Proin mollis, eros a fringilla blandit, erat orci pellentesque lacus, vitae hendrerit magna magna in leo. Donec tincidunt, turpis ac accumsan finibus, purus massa consectetur nunc, eu feugiat ipsum sapien eget velit. Maecenas aliquam pulvinar risus ut consectetur. Donec iaculis maximus lorem.',
        authorId: 1,
        author: {
            id: 1,
            username: 'FooBar'
        },
        createdAt: '2017-10-28T15:51:44.926Z'
    },
    {
        id: 2,
        title: 'Ajout du module #5541',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum faucibus aliquet. Proin mollis, eros a fringilla blandit, erat orci pellentesque lacus, vitae hendrerit magna magna in leo. Donec tincidunt, turpis ac accumsan finibus, purus massa consectetur nunc, eu feugiat ipsum sapien eget velit. Maecenas aliquam pulvinar risus ut consectetur. Donec iaculis maximus lorem.',
        authorId: 1,
        author: {
            id: 1,
            username: 'FooBar'
        },
        createdAt: '2017-10-27T20:01:44.926Z'
    },

];

export default {
    getAll() {
        return new Promise(resolve => resolve(_logs));
    },

    getById(id) {
        return new Promise(resolve => resolve(_logs.filter(log => log.id === parseInt(id))[0]));
    }
};