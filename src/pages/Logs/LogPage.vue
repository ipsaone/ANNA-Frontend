<template>
    <section class="logs basic-layout">
        <loader v-if="loading"></loader>
        <log></log>
        <upload-log></upload-log>

        <div class="logs content">
            <h1 class="section-title">Logs</h1>
            <template v-if="logs.length > 0">
                <section>
                    <div class="log" v-for="log in logs" :key="log.id" @click="showLog(log)">
                        <p class="date">{{ log.createdAt | moment('DD/MM/YYYY') }}</p>
                        <h1>{{ log.title }}</h1>
                    </div>
                </section>
            </template>
            <template v-else>
                <p class="no-log-message">
                    <b>No logs found</b><br>This means someone didn't do its job... Get to work !
                </p>
            </template>
        </div>
      </div>

        <div class="logs actions">
            <h1 class="section-title">Actions</h1>
            <ul>
              <li>
                <a href="#" @click.prevent="uploadLog"><i class="fa fa-plus" aria-hidden="true"></i>New log</a>
                </li>
              </ul>
            </div>
        </div>
    </section>
</template>

<script>
    import store from '@/store';
    import Loader from '@/components/Loader';
    import Log from '@/components/Log';
    import UploadLog from '@/components/UploadLog';

    export default {
        components: {
            Loader,
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
