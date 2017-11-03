import PostsApi from '@/api/posts';

const state = {
    posts: []
};

const mutations = {
    SET_ALL_POSTS(state, posts) {
        state.posts = posts;
    }
};

const actions = {
    retrievePosts({commit, state}, force = false) {
        return new Promise((resolve, reject) => {
            if (state.posts.length === 0 || force) { // If no posts is loaded
                PostsApi.getPublished()
                    .then(posts => {
                        commit('SET_ALL_POSTS', posts.data);
                        resolve();
                    })
                    .catch(err => reject(err));
            }
            else {
                resolve();
            }
        });
    },

    getPostById({dispatch, state}, id) {
        return dispatch('retrievePosts')
            .then(_ => {
                const post = state.posts.filter(post => post.id === parseInt(id))[0];

                if (typeof post !== 'undefined') return post;
                else throw Error;
            });
    },

    storePost({dispatch}, post) {
        return PostsApi.save(post)
            .then(_ => dispatch('retrievePosts', true));
    },

    updatePost({dispatch}, post) {
        return PostsApi.update(post)
            .then(_ => dispatch('retrievePosts', true));
    },

    deletePost({dispatch}, id) {
        return PostsApi.delete(id)
            .then(_ => dispatch('retrievePosts', true));
    }
};

const getters = {
    posts(state) {
        return state.posts;
    },

    post(state) {
        return state.post;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};