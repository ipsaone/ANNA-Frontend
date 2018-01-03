<template>
    <section class="dashboard basic-layout">
        <loader v-if="loading"></loader>
        <log></log>
        <upload-log></upload-log>

        <div class="missions content">
            <h1 class="section-title">Missions</h1>

            <missions-slider></missions-slider>
        </div>

        <div class="logs actions">
            <h1 class="section-title">Logs</h1>

            <section> <!-- DO NOT REMOVE THE SECTION TAG -->
                <div class="log" v-for="log in logs" :key="log.id" @click="showLog(log)">
                    <h1>{{ log.title }}</h1>
                </div>
            </section>

            <div class="bottom" @click="uploadLog">
                <p><a href="#">+</a></p>
                <p>Add</p>
            </div>
        </div>
    </section>
</template>

<script>
    import store from '@/store';
    import Loader from '@/components/Loader';
    import MissionsSlider from '@/components/MissionsSlider';
    import Log from '@/components/Log';
    import UploadLog from '@/components/UploadLog';

    export default {
        components: {
            Loader,
            MissionsSlider,
            Log,
            UploadLog
        },
        data() {
            return {
                loading: false
            };
        },
        mounted() {
            this.loading = true;
            store.dispatch('retrieveUsers')
                .then(store.dispatch('retrieveMissions', true))
                .then(store.dispatch('retrieveTasks', true))
                .then(store.dispatch('retrieveLogs', true))
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Can not retrieve data from server',
                        text: err.message,
                        duration: -1
                    });
                })
                .then(this.loading = false);
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