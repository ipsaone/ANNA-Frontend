<template>
    <section class="drive basic-layout">
        <upload-file></upload-file>
        <new-folder></new-folder>
        <edit-file></edit-file>
        <file-auth></file-auth>
        <barcode></barcode>
        <move-file></move-file>

        <section class="content">
            <h1 class=" section-title">Drive</h1>

            <drive-table></drive-table>
        </section>

        <section class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li>
                    <a href="#" @click.prevent="$modal.show('uploadFile')">
                        <i class="fa fa-upload" aria-hidden="true"></i> Upload
                    </a>
                </li>

                <li>
                    <a href="#" @click.prevent="$modal.show('newFolder')">
                        <i class="fa fa-plus" aria-hidden="true"></i> New folder
                    </a>
                </li>

                <li>
                    <a href="#" @click.prevent="newBarcode">
                        <i class="fa fa-barcode"></i> Generate a new barcode
                    </a>
                </li>

                <li>
                    <a href="#" @click.prevent="search">
                        <i class="fa fa-search"></i> Search in folder
                    </a>
                </li>
            </ul>
            <br>

            <div v-if="showOptions">
                <h1 class="section-title">Options</h1>
                <ul>
                    <li v-if="!selectedFile.isDir">
                        <a href="#" @click.prevent="downloadFile">
                            <i class="fa fa-download" aria-hidden="true"></i> Download
                        </a>
                    </li>
                    <li v-if="selectedFile.isDir">
                        <a href="#" @click.prevent="openFile">
                            <i class="fa fa-download" aria-hidden="true"></i> Open
                        </a>
                    </li>
                    <!--
                    <li>
                        <a href="#" @click.prevent="editFile">
                            <i class="fa fa-pencil" aria-hidden="true"></i> Edit
                        </a>
                    </li>
                    -->
                    <li>
                        <a href="#" @click.prevent="moveFile">
                            <i class="fa fa-folder" aria-hidden="true"></i> Move
                        </a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="deleteFile">
                            <i class="fa fa-trash"></i> Delete
                        </a>
                    </li>
                    <li><a href="#" @click.prevent="manageRights"><i class="fa fa-key"></i> Manage permissions</a></li>
                </ul>
            </div>
        </section>
    </section>
</template>

<script>
    import store from '@/modules/store';
    import driveApi from '@/modules/drive/drive_api';
    import DriveTable from './DriveTable';
    import UploadFile from './UploadFile';
    import NewFolder from './NewFolder';
    import EditFile from './EditFile';
    import FileAuth from './FileAuth';
    import Barcode from './Barcode';
    import MoveFile from './MoveFile';

    export default {
        components: {
            DriveTable,
            UploadFile,
            NewFolder,
            EditFile,
            FileAuth,
            Barcode,
            MoveFile
        },
        beforeRouteEnter(to, from, next) {
            let folderId = 1;
            console.log(store.getters.folder);
            if(store.getters.folder && store.getters.folder.id) {
                folderId = store.getters.folder.id;
            }

            store.dispatch('retrieveFolder', folderId)
                .then(() => next())
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
            search() {

            },
            manageRights() {
                this.$modal.show('fileAuth', this.selectedFile);
            },
            openFile() {
                if (this.selectedFile.isDir) {
                    this.loading = true;
                    store.dispatch('retrieveFolder', this.selectedFile.id)
                        .then(_ => store.dispatch('selectFile', {}))
                        .then(_ => this.loading = false);
                }
            },
            moveFile() {
                this.$modal.show('moveFile');
            },
            newBarcode() {
                this.$modal.show('barcode');
            },
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
