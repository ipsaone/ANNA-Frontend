import PostsApi from '@/api/test/posts';

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
    retrievePosts({commit, state}) {
        return new Promise((resolve, reject) => {
            if (state.posts.length === 0) { // If no posts is loaded
                PostsApi.getAll()
                    .then(posts => {
                        commit('SET_ALL_POSTS', posts.data);
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
            else {
                resolve();
            }
        });
    },

    updatePosts({commit}) {
        return new Promise((resolve, reject) => {
            PostsApi.getAll()
                .then(posts => {
                    commit('SET_ALL_POSTS', posts.data);
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    selectPost({commit, state}, id) {
        return new Promise(resolve => {
            commit('SELECT_POST', state.posts.filter(post => post.id === parseInt(id))[0]);
            resolve();
        });
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