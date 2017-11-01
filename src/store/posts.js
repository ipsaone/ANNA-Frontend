import PostsApi from '@/api/posts';

const state = {
    posts: [],
    post: {}
};

const mutations = {
    SET_ALL_POSTS(state, posts) {
        state.posts = posts;
    },

    SELECT_POST(state, post) {
        state.post = post;
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

    selectPost({commit, state}, id) {
        return new Promise(resolve => {
            commit('SELECT_POST', state.posts.filter(post => post.id === parseInt(id))[0]);
            resolve();
        });
    },

    storePost({dispatch}, post) {
        return PostsApi.save(post)
            .then(_ => dispatch('retrievePosts', true));
    },

    updatePost({dispatch}, post) {
        return PostsApi.update(post)
            .then(_ => dispatch('retrievePosts', true))
            .then(_ => dispatch('selectPost', post.id));
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