<template>
    <modal name="editFile" @before-close="beforeClose" height="auto" :scrollable="true">
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
    import store from '@/modules/store';
    import driveApi from '@/modules/drive/drive_api';

    export default {
        data() {
            return {
                file: '',
                folders: {},
                selectedFolder: '',
                target: []
            };
        },
        computed: {
            formatedFoldersList() {
                this.formatList(this.folders, this.target);
                this.target.reverse();
                return this.target;
            },
        },
        methods: {
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length > 0) this.file = files[0];
            },
            
            beforeClose(event) {
                this.target = [];
                this.selectedFolder = '';
                store.dispatch('unselectFile');
            },
            async onSubmit() {
                console.log(this.selectedFolder);
                const edit = {
                    fileId: store.getters.selectedFile.fileId,
                    data: {}
                };

                if(this.file) {
                    edit.data.contents = this.file;
                }

                try {
                    await driveApi.editFile(edit);
                    await store.dispatch('retrieveFolder', store.getters.folder.id);
                    this.$modal.hide('editFile');
                } catch (err) {
                    this.$notify({
                        type: 'error',
                        title: 'Uncaught error',
                        text: err.message,
                        duration: -1
                    });
                }
            }
        }
    };
</script>