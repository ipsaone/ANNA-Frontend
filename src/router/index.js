import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'root',
            redirect: {name: 'dashboard'}
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
            path: '/user/:id',
            name: 'user',
            component: resolve => require(['@/pages/UserPage.vue'], resolve)
        },
        {
            path: '/blog',
            name: 'blog',
            component: resolve => require(['@/pages/BlogPage.vue'], resolve)
        },
        {
            path: '/blog/post/:id',
            name: 'readPost',
            component: resolve => require(['@/pages/PostPage.vue'], resolve)
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
            path: '/profile',
            name: 'profile',
            component: resolve => require(['@/pages/ProfilePage.vue'], resolve)
        },
        {
            path: '*',
            name: 'pageNotFound',
            component: resolve => require(['@/pages/PageNotFound.vue'], resolve)
        }
    ]
});

router.beforeEach((to, from, next) => {
    if(to.path !== '/login' && !store.getters.isLogged)
        next({name: 'login'});
    else if (to.path === '/login' && store.getters.isLogged)
        next({name: 'dashboard'});
    else
        next();
});

export default router;