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
            onSubmit() {
                const data = {
                    name: this.name,
                    isDir: true,
                    ownerId: store.getters.loggedUserId,
                    dirId: store.getters.folder.id,
                    groupId: 1,
                    allRead: 1,
                    allWrite: 1,
                    groupRead: 1,
                    groupWrite: 1,
                    ownerWrite: 1,
                    ownerRead: 1,
                };

                return driveApi.uploadFile(data)
                    .then(this.$modal.hide('newFolder'))
                    .then(store.dispatch('retrieveFolder', store.getters.folder.id))
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