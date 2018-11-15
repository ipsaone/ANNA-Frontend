import Vue from 'vue';
import Router from 'vue-router';
import store from '@/modules/store';
import authApi from '@/modules/auth/auth_api';

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
            component: resolve => require(['./Login/LoginPage.vue'], resolve)
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: resolve => require(['./Dashboard/DashboardPage.vue'], resolve)
        },
        {
            path: '/users/:id(\\d+)',
            name: 'profile',
            component: resolve => require(['./Profile/ProfilePage.vue'], resolve)
        },
        {
            path: '/blog',
            name: 'blog',
            component: resolve => require(['./Blog/BlogPage.vue'], resolve)
        },
        {
            path: '/blog/post/:id(\\d+)',
            name: 'readPost',
            component: resolve => require(['./Blog/PostPage.vue'], resolve)
        },
        {
            path: '/blog/post/edit/:id(\\d+)',
            name: 'editPost',
            component: resolve => require(['./Blog/EditPostPage.vue'], resolve)
        },
        {
            path: '/blog/post/new',
            name: 'newPost',
            component: resolve => require(['./Blog/NewPostPage.vue'], resolve)
        },
        {
            path: '/drive',
            name: 'drive',
            component: resolve => require(['./Drive/DrivePage.vue'], resolve)
        },
        {
            path: '/events',
            name: 'events',
            component: resolve => require(['./Events/EventsPage.vue'], resolve)
        },
        {
            path: '/gantt',
            name: 'gantt',
            component: resolve => require(['./Gantt/GanttPage.vue'], resolve)
        },
        {
            path: '/administration',
            name: 'admin',
            component: resolve => require(['./Admin/AdminPage.vue'], resolve)
        },
        {
            path: '/logs',
            name: 'logs',
            component: resolve => require(['./Logs/LogPage.vue'], resolve)
        },
        {
            path: '*',
            name: 'pageNotFound',
            component: resolve => require(['./PageNotFound.vue'], resolve)
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && !store.getters.isLogged) {
        // If the user is not logged and try to go to another page than /login
        // We need to check if he is logged or not on the server
        authApi.check()
            .then(user => { // If he is logged on the server
                store.commit('SET_LOGGED_USER', user.data); // Reload the user data
                next(); // And let him continue his navigation
            })
            .catch(_ => { // If he is not logged
                next({name: 'login'}); // We redirect him to the login page
            });
    }
    else if (to.path === '/login' && store.getters.isLogged) // If the user is logged and try to go to /login
        next({name: 'dashboard'}); // Redirect him to the dashboard
    else {
        // If he is logged, no problem
        next();
    }
});

export default router;
