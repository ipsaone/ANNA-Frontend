<template>
    <section class="dashboard">
        <section class="content">
            <h1 class="section-title color-purple">Missions</h1>

            <missions-slider></missions-slider>
        </section>
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
        async mounted() {
            await store.dispatch('retrieveLoggedUser');
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
