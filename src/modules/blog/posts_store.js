import PostsApi from './posts_api';

const state = {
    posts: [],
    post: {},
    drafts: []
};

const mutations = {
    SET_ALL_POSTS(state, posts) {
        state.posts = posts;
    },

    SET_ALL_DRAFTS(state, drafts) {
        state.drafts = drafts;
    },

    SELECT_POST(state, post) {
        state.post = post;
    },

    CLEAR_POST(state) {
        state.post = {};
    }
};

const actions = {
    async retrievePosts({commit, state}, force = false) {
        if (state.posts.length === 0 || force) { // If no posts is loaded
            let posts = await PostsApi.getAll();
            commit('SET_ALL_POSTS', posts.data);
        }
        else {
            return Promise.resolve();
        }
    },

    async selectPost({dispatch, commit, state}, id) {
        await dispatch('retrievePosts');
        const post = state.posts.filter(post => post.id === parseInt(id))[0];
        

        if (typeof post !== 'undefined') {
            commit('SELECT_POST', post);
        }
        else {
            const draft = state.drafts.filter(post => post.id === parseInt(id))[0];
            if (typeof draft !== 'undefined') {
                commit('SELECT_POST', draft);
            }
            else {
                throw Error;
            }
        };
    },

    async storePost({dispatch}, post) {
        await  PostsApi.save(post);
        dispatch('retrievePosts', true);
    },

    async updatePost({dispatch}, post) {
        await PostsApi.update(post);
        await dispatch('retrievePosts', true);
        await dispatch('selectPost', post.id);
    },

    async deletePost({dispatch}, id) {
        await PostsApi.delete(id);
        dispatch('retrievePosts', true);
    }
};

const getters = {
    posts(state) {
        return state.posts;
    },

    selectedPost(state) {
        return state.post;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
