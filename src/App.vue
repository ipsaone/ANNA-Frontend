<template>
    <div :class="($route.path === '/login') ? 'login' : 'app'">
        <v-dialog/>
        <notifications/>
        <div v-if="$route.path !== '/login'">
            <sidebar></sidebar>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import Sidebar from '@/components/Sidebar';
    import store from '@/modules/store';

    export default {
        components: {
            Sidebar
        },
        name: 'app'
    };
</script>

<style src="./assets/scss/app.scss" lang="scss" rel="stylesheet/scss"></style>