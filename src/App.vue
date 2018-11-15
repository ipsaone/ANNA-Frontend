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

    import axios from 'axios';
    import Vue from 'vue';

    axios.interceptors.response.use(res => res, err => {
        Vue.notify({
            type: 'error',
            title: 'An error occured (code '+err.response.status+')',
            text: err.response.data.message || err.response.data.error,
            duration: 5000
        });
        

        console.error(err);
        return Promise.reject(err);
    });


    export default {
        components: {
            Sidebar,
            IdleModal
        },
        name: 'app'
    };
</script>

<style src="./assets/scss/app.scss" lang="scss" rel="stylesheet/scss"></style>
