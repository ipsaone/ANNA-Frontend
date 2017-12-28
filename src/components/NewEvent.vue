<template>
    <modal name="newEvent" height="auto">
        <div class="content anna-modal">
            <h1>Create a new event</h1>
            <form @submit.prevent="onSubmit">
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">
                <markdown-editor v-model="markdown"></markdown-editor>
                <button type="submit" class="button success">Submit</button>
            </form>
        </div>
    </modal>
</template>

<script>
    import store from '@/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';

    export default {
        components: {
            markdownEditor
        },
        data() {
            return {
                name: '',
                markdown: ''
            };
        },
        methods: {
            onSubmit() {
                const data = {
                    name: this.name,
                    markdown: this.markdown
                };
                store.dispatch('storeEvent', data)
                    .then(this.$modal.hide('newEvent'))
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