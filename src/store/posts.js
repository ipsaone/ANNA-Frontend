import PostsApi from '@/api/posts';

const state = {
    posts: []
};

const mutations = {
    GET_ALL(state, posts) {
        state.posts = posts;
    },

    ADD_USER(state, post) {
        state.posts.push(post);
    },

    UPDATE_USER(state, editUser) {
        state.user = Object.assign({}, state.user, editUser);
    },

    DELETE_USER(state, posts) {
        state.posts = posts;
    }
};

const actions = {
    getAllUsers({commit}) {
        UsersApi.getAll().then(posts => {
            commit('GET_ALL', posts.data);
        });
    },

    addUser({commit}, user) {
        UsersApi.postUser(user).then(res => {
            console.log(res);
            commit('ADD_USER', user);
        });
    }
};

const getters = {
    allUsers(state) {
        return state.users;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};