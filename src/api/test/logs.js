const _logs = [
    {
        id: 1,
        title: 'Ajout du module #5542',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum faucibus aliquet. Proin mollis, eros a fringilla blandit, erat orci pellentesque lacus, vitae hendrerit magna magna in leo. Donec tincidunt, turpis ac accumsan finibus, purus massa consectetur nunc, eu feugiat ipsum sapien eget velit. Maecenas aliquam pulvinar risus ut consectetur. Donec iaculis maximus lorem.',
        author_id: 1,
        author: {
            id: 1,
            username: 'FooBar'
        },
        created_at: '22/10/2017 - 21:36'
    },
    {
        id: 2,
        title: 'Ajout du module #5541',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum faucibus aliquet. Proin mollis, eros a fringilla blandit, erat orci pellentesque lacus, vitae hendrerit magna magna in leo. Donec tincidunt, turpis ac accumsan finibus, purus massa consectetur nunc, eu feugiat ipsum sapien eget velit. Maecenas aliquam pulvinar risus ut consectetur. Donec iaculis maximus lorem.',
        author_id: 1,
        author: {
            id: 1,
            username: 'FooBar'
        },
        created_at: '21/10/2017 - 17:51'
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