import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import authApi from '@/api/auth';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'root',
            redirect: {name: 'login'}
        },
        {
            path: '/login',
            name: 'login',
            component: resolve => require(['@/pages/LoginPage.vue'], resolve)
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: resolve => require(['@/pages/DashboardPage.vue'], resolve)
        },
        {
            path: '/users/:id(\\d+)',
            name: 'profile',
            component: resolve => require(['@/pages/ProfilePage.vue'], resolve)
        },
        {
            path: '/blog',
            name: 'blog',
            component: resolve => require(['@/pages/Blog/BlogPage.vue'], resolve)
        },
        {
            path: '/blog/post/:id(\\d+)',
            name: 'readPost',
            component: resolve => require(['@/pages/Blog/PostPage.vue'], resolve)
        },
        {
            path: '/blog/post/edit/:id(\\d+)',
            name: 'editPost',
            component: resolve => require(['@/pages/Blog/EditPostPage.vue'], resolve)
        },
        {
            path: '/blog/post/new',
            name: 'newPost',
            component: resolve => require(['@/pages/Blog/NewPostPage.vue'], resolve)
        },
        {
            path: '/drive',
            name: 'drive',
            component: resolve => require(['@/pages/DrivePage.vue'], resolve)
        },
        {
            path: '/forum',
            name: 'forum',
            component: resolve => require(['@/pages/ForumPage.vue'], resolve)
        },
        {
            path: '/events',
            name: 'events',
            component: resolve => require(['@/pages/EventsPage.vue'], resolve)
        },
        {
            path: '/gantt',
            name: 'gantt',
            component: resolve => require(['@/pages/GanttPage.vue'], resolve)
        },
        {
            path: '*',
            name: 'pageNotFound',
            component: resolve => require(['@/pages/PageNotFound.vue'], resolve)
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && !store.getters.isLogged) {
        // If the user is not logged and try to go to another page than /login
        // We need to check if he is logged or not on the server
        authApi.check()
            .then(user => { // If he is logged on the server
                console.log('The user is connected on the server');
                console.log(user);
                store.commit('SET_LOGGED_USER', {id: user.data.id, username: user.data.username}); // Reload the user data
                next(); // And let him continue his navigation
            })
            .catch(_ => { // If he is not logged
                next({name: 'login'}); // We redirect him to the login page
            });
    }
    else if (to.path === '/login' && store.getters.isLogged) // If the user is logged and try to go to /login
        next({name: 'dashboard'}); // Redirect him to the dashboard
    else // If he is logged, no problem
        next();
});

export default router;