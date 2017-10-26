import PostsApi from '@/api/test/posts';

const state = {
    posts: [],
    post: {}
};

const mutations = {
    GET_ALL(state, posts) {
        state.posts = posts;
    },

    GET_POST(state, post) {
        state.post = post;
    },

    ADD_POST(state, post) {
        state.posts.push(post);
    }
};

const actions = {
    getAllPosts({commit}) {
        PostsApi.getAll().then(posts => {
            commit('GET_ALL', posts);
        });
    },

    getPost({commit}, id) {
        PostsApi.getPostById(id).then(post => {
            commit('GET_POST', post);
        });
    },

    addPost({commit}, post) {
        PostsApi.postPost(post).then(res => {
            commit('ADD_POST', post);
        });
    }
};

const getters = {
    allPosts(state) {
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