<template>
    <modal name="uploadFile" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Upload a new file</h1>
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
                file: ''
            };
        },
        methods: {
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length > 0) this.file = files[0];
            },
            async onSubmit() {
                const data = {
                    contents: this.file,
                    name: this.file.name,
                    ownerId: store.getters.loggedUserId,
                    dirId: store.getters.folder.fileId,
                    groupId: 1,
                    allRead: 1,
                    allWrite: 1,
                    groupRead: 1,
                    groupWrite: 1,
                    ownerWrite: 1,
                    ownerRead: 1,
                };

                await driveApi.uploadFile(data);
                await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                this.$modal.hide('uploadFile');
              
            }
        }
    };
</script>