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
    import {mapGetters} from 'vuex';
    import Sidebar from '@/components/Sidebar';

    export default {
        mounted() {
            this.updateStatuses();
        },
        components: {
            Sidebar
        },
        computed: {
            ...mapGetters([
                'statuses'
            ])
        },
        methods: {
            updateStatuses() {
                this.statuses.forEach(status => {
                    this.$notify(status);
                });
            },
            clearStatuses() {
                this.$notify({clear: true});
            }
        },
        watch: {
            '$route'(to, from) {
                this.clearStatuses();
                this.updateStatuses();
            }
        },
        name: 'app'
    };
</script>

<style src="./assets/scss/app.scss" lang="scss" rel="stylesheet/scss"></style>