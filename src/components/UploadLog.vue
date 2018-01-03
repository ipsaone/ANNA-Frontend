<template>
    <modal name="uploadLog" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Create a new log</h1>
            <form @submit.prevent="onSubmit">
                <input type="text" name="title" id="title" placeholder="Title..." v-model="title">
                <markdown-editor v-model="markdown"></markdown-editor>
                <button type="submit" class="button success">Submit</button>
            </form>
        </div>
    </modal>
</template>

<script>
    import store from '@/store';
    import logsApi from '@/api/logs';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';

    export default {
        components: {
            markdownEditor
        },
        data() {
            return {
                title: '',
                markdown: ''
            };
        },
        methods: {
            onSubmit() {
                const data = {
                    title: this.title,
                    markdown: this.markdown,
                    authorId: store.getters.loggedUserId
                };
                store.dispatch('storeLog', data)
                    .then(this.$modal.hide('uploadLog'))
                    .then(_ => {
                        this.title = '';
                        this.markdown = '';
                    })
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'Uncaught error',
                            text: err.message,
                            duration: -1
                        });
                    });
            }
        }
    };
</script>