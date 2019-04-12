<template>
    <div :class="($route.path === '/login') ? 'login' : 'app'">
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">

        <v-dialog/>
        <notifications/>
        <div v-if="$route.path !== '/login' && $route.path !=='/'">
            <sidebar></sidebar>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import Sidebar from '@/components/Sidebar';
    import store from '@/modules/store';

    import axios from 'axios';
    import Vue from 'vue';
    import Progress from 'vue-multiple-progress';
    Vue.component('VmProgress', Progress);

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
            Sidebar
        },
        name: 'app'
    };
</script>

<style src="./assets/scss/app.scss" lang="scss" rel="stylesheet/scss"></style>
