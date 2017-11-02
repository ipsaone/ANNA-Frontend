<template>
    <section class="dashboard">
        <loader v-if="loading"></loader>

        <div class="missions">
            <h1 class="section-title">Missions</h1>
        </div>

        <div class="logs">
            <h1 class="section-title">Logs</h1>

            <section> <!-- DO NOT REMOVE THE SECTION TAG -->
                <log v-for="log in logs" :key="log.id" :log="log"></log>
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
    import Log from '@/components/Log';
    import Loader from '@/components/Loader';

    export default {
        components: {
            Log,
            Loader
        },
        data() {
            return {
                loading: false
            };
        },
        mounted() {
            this.loading = true;
            store.dispatch('retrieveLogs')
                .catch(err => {
                    console.log(err.message);
                    this.$notify({
                        type: 'error',
                        title: 'Can not retrieve the posts',
                        text: err.message,
                        duration: -1
                    });
                })
                .then(_ => {
                    this.loading = false;
                });

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
            }
        }
    };
</script>