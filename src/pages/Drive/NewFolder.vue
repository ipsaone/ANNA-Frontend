<template>
    <modal name="newFolder" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>New folder</h1>

            <form @submit.prevent="onSubmit">
                <input type="text" placeholder="Name" v-model="name">
                <input type="submit" value="Create" class="button success">
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
                name: ''
            };
        },
        methods: {
            async onSubmit() {
                const data = {
                    name: this.name,
                    isDir: true,
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

                if (this.name.trim() !== ''){
                    console.log('groupe de tes morts', store.getters.loggedUser.groups);
                    await driveApi.uploadFile(data);
                    await this.$modal.hide('newFolder');
                    await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                } else {
                    this.$notify({
                        type: 'error',
                        title: 'invalid name',
                        text: 'folder name must not be empty',
                        duration: -1
                    });
                }

            }
        }
    };
</script>
