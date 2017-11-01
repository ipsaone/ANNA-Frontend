<template>
    <section class="dashboard">
        <div class="missions">
            <h1 class="section-title">Missions</h1>
        </div>

        <div class="logs">
            <h1 class="section-title">Logs</h1>

            <section> <!-- DO NOT REMOVE THE SECTION TAG -->
                <log v-for="log in allLogs" :key="log.id" :log="log"></log>
            </section>

            <div class="bottom" @click.prevent="addLog">
                <p><a href="#">+</a></p>
                <p>Add</p>
            </div>
        </div>
    </section>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import swal from 'sweetalert2';
    import Log from '@/components/Log';

    export default {
        components: {
            Log
        },
        mounted() {
            this.getAllLogs();
        },
        computed: {
            ...mapGetters([
                'allLogs'
            ])
        },
        methods: {
            ...mapActions([
                'getAllLogs'
            ]),
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