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
    retrievePosts({commit, state}, force = false) {
        if (state.posts.length === 0 || force) { // If no posts is loaded
            return PostsApi.getPublished().then(posts => commit('SET_ALL_POSTS', posts.data));
        }
        else {
            return Promise.resolve();
        }
    },

    retrieveDrafts({commit, state}, force = false) {
        console.log('draaaaaaaaaaaafts');
        PostsApi.getDrafted().then(drafts => commit('SET_ALL_DRAFTS', drafts.data));
    },

    selectPost({dispatch, commit, state}, id) {
        return dispatch('retrievePosts')
            .then(_ => {
                const post = state.posts.filter(post => post.id === parseInt(id))[0];

                if (typeof post !== 'undefined') commit('SELECT_POST', post);
                else throw Error;
            });
    },

    selectDraft({dispatch, commit, state}, id) {
        return dispatch('retrieveDrafts')
            .then(_ => {
                const post = state.drafts.filter(post => post.id === parseInt(id))[0];

                if (typeof post !== 'undefined') commit('SELECT_POST', post);
                else throw Error;
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

    selectedPost(state) {
        return state.post;
    },
    drafts(state) {
        return state.drafts;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
