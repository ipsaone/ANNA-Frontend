const _posts = [
    {
        id: 1,
        title: 'Lorem Ipsum',
        markdown: `This document serves as the **complete** definition of IPSA ONE's coding standards for source code in the JavaScript programming language.`,
        content: `<p>This document serves as the <b>complete</b> definition of IPSA ONE's coding standards for source code in the JavaScript programming language.</p>`,
        authorId: 1,
        publishedAt: '2017-10-22T20:01:44.926Z'
    },

    {
        id: 2,
        title: 'Lorem Ipsum 2',
        markdown: `Oh! *Du* **Markdown**.`,
        content: `<p>Oh! <i>Du</i> <b>Markdown</b>.</p>`,
        authorId: 2,
        publishedAt: '2017-10-25T20:01:44.926Z'
    },
    {
        id: 3,
        title: 'Lancement du twitter d\'IPSA ONE !',
        content: `Super twitter!`,
        authorId: 2,
        publishedAt: '2017-10-27T20:01:44.926Z'
    }
];

export default {
    getAll() {
        return new Promise(resolve => {
            resolve(_posts);
        });
    },

    getPostById(id) {
        return new Promise(resolve => {
            resolve(_posts.filter(post => post.id === parseInt(id))[0]);
        });
    },

    postPost(post) {
        return new Promise(resolve => {
            resolve(_posts.push(post));
        });
    },

    updatePost(post) {
        return new Promise(resolve => {
            for (let i in _posts) {
                if (_posts[i].id === post.id) {
                    resolve(_posts[i] = post);
                    break;
                }
            }
        });
    },

    deletePost(post) {
        return new Promise((resolve, reject) => {
            const i = _posts.indexOf(post);
            if (i !== -1)
                resolve(_posts.splice(i, 1));
            else
                reject(false);
        });
    }
};