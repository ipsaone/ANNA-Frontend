<template>
    <section class="dashboard">
        <loader v-if="loading"></loader>

        <div class="missions content">
            <h1 class="section-title">Missions</h1>

            <missions-slider></missions-slider>
        </div>
    </section>
</template>

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';
    import MissionsSlider from './MissionsSlider';

    export default {
        components: {
            Loader,
            MissionsSlider
        },
        data() {
            return {
                loading: false
            };
        },
        mounted() {
            store.dispatch('retrieveLoggedUser');
        },
        computed: {
            logs() {
                return store.getters.logs;
            },
        },
        methods: {
            uploadLog() {
                this.$modal.show('uploadLog');
            },
            showLog(log) {
                this.$modal.show('log', {'log': log});
            }
        }
    };
</script>
