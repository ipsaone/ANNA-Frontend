<template>
    <modal name="newFolder" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>New folder</h1>

            <form @submit.prevent="onSubmit">
                <input type="text" placeholder="Name" v-model="name">
                <input type="submit" @click.prevent="onSubmit" value="Create" class="button success">
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
                name: '',
                isEditing: ''
            };
        },
        methods: {
            beforeOpen(event) {
                console.log(event.params.isEditing);
                this.isEditing = event.params.isEditing;
            },
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

                if (this.name.trim() !== '' & store.getters.loggedUser.groups.length !== 0){
                    await driveApi.uploadFile(data);
                    await this.$modal.hide('newFolder');
                    await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                } else if (this.name.trim() == '') {
                    this.$notify({
                        type: 'error',
                        title: 'invalid name',
                        text: 'folder name must not be empty',
                        duration: -1
                    });
                } else {
                    this.$notify({
                        type: 'error',
                        title: 'No assigned group',
                        text: 'You must be in a group to create a folder.',
                        duration: -1
                    });
                }
            }
        }
    };
</script>
