let _posts = {
    data: [
        {
            id: 1,
            title: 'Lorem Ipsum',
            markdown: `This document serves as the **complete** definition of IPSA ONE's coding standards for source code in the JavaScript programming language.`,
            content: `<p>This document serves as the <b>complete</b> definition of IPSA ONE's coding standards for source code in the JavaScript programming language.</p>`,
            authorId: 1,
            author: {
                id: 1,
                username: 'FooBar'
            },
            publishedAt: '2017/10/22 - 20:01'
        },

        {
            id: 2,
            title: 'Lorem Ipsum 2',
            markdown: `Oh! *Du* **Markdown**.`,
            content: `<p>Oh! <i>Du</i> <b>Markdown</b>.</p>`,
            authorId: 2,
            author: {
                id: 2,
                username: 'Fifou'
            },
            publishedAt: '2017/10/25 - 20:01'
        },
        {
            id: 3,
            title: 'Lancement du twitter d\'IPSA ONE !',
            content: `Super twitter!`,
            authorId: 2,
            author: {
                id: 2,
                username: 'Fifou'
            },
            publishedAt: '2017/10/27 - 20:01'
        }
    ]
};

export default {
    getAll() {
        return new Promise(resolve => {
            resolve(_posts);
        });
    },

    store(post) {
        return new Promise(resolve => {
            _posts.data.unshift(post);
            resolve();
        });
    }
};