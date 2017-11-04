<template>
    <section class="dashboard">
        <loader v-if="loading"></loader>

        <log></log>

        <div class="missions">
            <h1 class="section-title">Missions</h1>
        </div>

        <div class="logs">
            <h1 class="section-title">Logs</h1>

            <section> <!-- DO NOT REMOVE THE SECTION TAG -->
                <div class="log" v-for="log in logs" :key="log.id" @click="showLog(log)">
                    <h1>{{ log.title }}</h1>
                </div>
            </section>

            <div class="bottom" @click.prevent="addLog">
                <p><a href="#">+</a></p>
                <p>Add</p>
            </div>
        </div>
    </section>
</template>

<script>
    import store from '@/store';
    import swal from 'sweetalert2';
    import Loader from '@/components/Loader';
    import Log from '@/components/Log';

    export default {
        components: {
            Loader,
            Log
        },
        data() {
            return {
                loading: false
            };
        },
        mounted() {
            this.loading = true;
            store.dispatch('retrieveUsers')
                .then(store.dispatch('retrieveLogs'))
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
            addLog() {
                swal.setDefaults({
                    confirmButtonText: 'Next &rarr;',
                    showCancelButton: true,
                    progressSteps: ['1', '2']
                });

                const steps = [
                    {
                        title: 'Log title',
                        input: 'text'
                    },
                    {
                        title: 'Description',
                        input: 'textarea'
                    }
                ];

                swal.queue(steps).then(result => {
                    swal.resetDefaults();
                    swal({
                        title: 'All done!',
                        html:
                        'Your answers: <pre>' +
                        JSON.stringify(result) +
                        '</pre>',
                        confirmButtonText: 'Send!'
                    });
                }).catch(_ => {
                    swal.resetDefaults();
                });
            },
            showLog(log) {
                this.$modal.show('log', {log: log});
            },
            hideLog() {
                this.$modal.hide('log');
            }
        }
    };
</script>