<template>
    <div :class="($route.path === '/login') ? 'login' : 'app'">
        <notifications/>
        <div v-if="$route.path !== '/login'">
            <sidebar></sidebar>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import Sidebar from '@/components/Sidebar';
    import store from '@/store';

    export default {
        components: {
            Sidebar
        },
        name: 'app'
    };
</script>

<style src="./assets/scss/app.scss" lang="scss" rel="stylesheet/scss"></style>