<template>
    <div class="app">
        <div v-if="this.$route.path !== '/login'">
            <sidebar></sidebar>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import Sidebar from '@/components/Sidebar';

    export default {
        components: {
            Sidebar
        },
        name: 'app',
    };
</script>

<style src="./assets/scss/app.scss" lang="scss" rel="stylesheet/scss"></style>