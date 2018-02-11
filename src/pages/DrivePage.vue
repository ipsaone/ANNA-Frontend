<template>
    <section class="drive basic-layout">
        <upload-file></upload-file>
        <new-folder></new-folder>
        <edit-file></edit-file>

        <section class="content">
            <h1 class=" section-title">Drive</h1>

            <drive-table></drive-table>
        </section>

        <section class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li>
                    <a href="#" @click.prevent="$modal.show('uploadFile')"><i class="fa fa-upload"
                                                                              aria-hidden="true"></i> Upload</a>
                </li>

                <li>
                    <a href="#" @click.prevent="$modal.show('newFolder')"><i class="fa fa-plus" aria-hidden="true"></i>
                        New folder</a>
                </li>
                <li>
                    <a href="#" @click.prevent="refreshFolder"><i class="fa fa-refresh" aria-hidden="true"></i> Refresh</a>
                </li>
            </ul>

            <div v-if="showOptions">
                <h1 class="section-title">Options</h1>
                <ul>
                    <li v-if="!selectedFile.isDir">
                        <a href="#" @click.prevent="downloadFile"><i class="fa fa-download" aria-hidden="true"></i>
                            Download</a>
                    </li>
                    <li><a href="#" @click.prevent="editFile"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</a>
                    </li>
                    <li><a href="#" @click.prevent="deleteFile"><i class="fa fa-trash"></i> Delete</a></li>
                </ul>
            </div>
        </section>
    </section>
</template>

<script>
    import store from '@/store';
    import driveApi from '@/api/drive';
    import DriveTable from '@/components/DriveTable';
    import UploadFile from '@/components/UploadFile';
    import NewFolder from '@/components/NewFolder';
    import EditFile from '@/components/EditFile';

    export default {
        components: {
            DriveTable,
            UploadFile,
            NewFolder,
            EditFile
        },
        beforeRouteEnter(to, from, next) {
            store.dispatch('retrieveFolder', 1)
                .then(_ => next())
                .catch(err => console.log(err));
        },
        computed: {
            selectedFile() {
                return store.getters.selectedFile;
            },
            showOptions() {
                return typeof this.selectedFile !== 'undefined' && typeof this.selectedFile.id !== 'undefined';
            }
        },
        methods: {
            downloadFile() {
                driveApi.downloadFile(this.selectedFile.id);
            },
            editFile() {
                if (this.selectedFile.isDir)
                    console.log('edit folder');
                else
                    this.$modal.show('editFile');
            },
            deleteFile() {
                this.$modal.show('dialog', {
                    title: 'Are you sure?',
                    text: 'You will delete ' + this.selectedFile.name + ' from the IPSA ONE drive.',
                    buttons: [
                        {
                            title: 'Delete it',
                            default: true,
                            handler: () => {
                                driveApi.deleteFile(this.selectedFile.id)
                                    .then(store.dispatch('retrieveFolder', this.selectedFile.folderId))
                                    .then(console.log('deleted'))
                                    .then(store.dispatch('unselectFile'))
                                    .then(this.$modal.hide('dialog'));
                            }
                        },
                        {
                            title: 'Close'
                        }
                    ]
                });
            },
            refreshFolder() {
                store.dispatch('retrieveFolder', store.getters.folder.id);
            }
        }
    };
</script>
