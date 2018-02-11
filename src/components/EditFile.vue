<template>
    <modal name="editFile" @before-open="beforeOpen" @before-close="beforeClose" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Edit {{ file.name }}</h1>
            <form @submit.prevent="onSubmit">
                <input type="file" @change="onFileChange">
                <button type="submit" class="button success">Submit</button>
            </form>
        </div>
    </modal>
</template>

<script>
    import store from '@/store';
    import driveApi from '@/api/drive';

    export default {
        data() {
            return {
                file: '',
            };
        },
        computed: {},
        methods: {
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length > 0) this.file = files[0];
            },
            beforeOpen(event) {
                this.file = store.getters.selectedFile;
            },
            beforeClose(event) {
                store.dispatch('unselectFile');
            },
            onSubmit() {
                const data = {
                    fileId: store.getters.selectedFile.id,
                    contents: this.file
                };

                driveApi.editFile(data)
                    .then(store.dispatch('retrieveFolder', store.getters.folder.id))
                    .then(this.$modal.hide('editFile'))
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