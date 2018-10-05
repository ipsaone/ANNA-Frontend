<template>
    <div :class="($route.path === '/login') ? 'login' : 'app'">
        <v-dialog/>
        <notifications/>
        <div v-if="$route.path !== '/login'">
            <idle-modal></idle-modal>
            <sidebar></sidebar>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import Sidebar from '@/components/Sidebar';
    import store from '@/modules/store';
    import IdleModal from '@/pages/Login/IdleModal';


    export default {
        components: {
            Sidebar,
            IdleModal
        },
        name: 'app'
    };
</script>

<style src="./assets/scss/app.scss" lang="scss" rel="stylesheet/scss"></style>
