<template>
    <section class="dashboard">
        <section class="content">
            <h1 class="section-title color-purple">
                Missions
            </h1>

            <missions-slider />
        </section>
    </section>
</template>

<script>
import store from '@/modules/store';
import MissionsSlider from './MissionsSlider';

export default {
    components: {
        MissionsSlider
    },
    data() {
        return {
            loading: false
        };
    },
    computed: {
        logs() {
            return store.getters.logs;
        },
    },
    async mounted() {
        await store.dispatch('retrieveLoggedUser');
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
