<template>
    <modal name="uploadFile" height="auto">
        <div class="content anna-modal">
            <h1>Upload a new file</h1>
            <form @submit.prevent="onSubmit">
                <input type="file" @change="onFileChange">
                <button type="submit">Submit</button>
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
                file: ''
            };
        },
        methods: {
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files;
                console.log(files);
                if (files.length > 0) this.file = files[0];
            },
            onSubmit() {
                const data = {
                    file: this.file,
                    ownerId: store.getters.loggedUserId,
                    dirId: store.getters.folder.id,
                };
                driveApi.uploadFile(this.file);
            }
        }
    };
</script>