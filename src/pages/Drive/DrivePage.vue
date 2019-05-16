<template>
    <section class="drive basic-layout">
        <upload-file></upload-file>
        <new-folder></new-folder>
        <barcode></barcode>
        <move-file></move-file>

        <section class="content">
            <h1 class="color-green section-title">Drive</h1>

            <drive-table :search="searchKeyWord"></drive-table>
        </section>

        <section class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li id="barre" v-if="$store.getters.loggedUser.groups.length !== 0">
                    <a href="#" @input="search(searchKeyWord, searchTypes)">
                        <i class="fas fa-search" aria-hidden="true" ></i>
                        <input class="search" style="padding: 0; margin: 0;" v-model="searchKeyWord" type="search">
                    </a>
                    <div class="search_options" v-if="searchKeyWord.length > 0">
                        <input type="checkbox"  value='name' v-model="searchTypes">Name
                        <input type="checkbox"  value='serialNbr' v-model="searchTypes">Serial number
                    </div>
                </li>
                <li v-if="$store.getters.loggedUser.groups && $store.getters.loggedUser.groups.length !== 0">
                    <a href="#" @click.prevent="$modal.show('uploadFile', {isFolder: false, isEditing: false})">
                        <i class="fa fa-upload" aria-hidden="true"></i> Upload
                    </a>
                </li>

                <li v-if="$store.getters.loggedUser.groups && $store.getters.loggedUser.groups.length !== 0">
                    <a href="#" @click.prevent="$modal.show('uploadFile', {isFolder: true, isEditing: false})">
                        <i class="fa fa-plus" aria-hidden="true"></i> New folder
                    </a>
                </li>

                <li style="padding-right: 15px !important">
                    <p  v-if="$store.getters.loggedUser.groups.length == 0"
                        style="margin-right: 160px; word-break: break-word;">

                        Join a group to be able to upload files and create folders !
                    </p>
                </li>

                <li>
                    <a href="#" @click.prevent="newBarcode">
                        <i class="fa fa-barcode"></i> Generate a new barcode
                    </a>
                </li>
            </ul>

            <br>

            <div v-if="showOptions">
                <h1 class="section-title">Options</h1>
                <ul>
                    <li v-if="selectedFile.type != 'folder'">
                        <a href="#" @click.prevent="downloadFile">
                            <i class="fa fa-download" aria-hidden="true"></i> Download
                        </a>
                    </li>
                    <li v-else>
                        <a href="#" @click.prevent="openFile">
                            <i class="fa fa-download" aria-hidden="true"></i> Open
                        </a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="moveFile">
                            <i class="fa fa-folder" aria-hidden="true"></i> Move
                        </a>
                    </li>
                    <li>
                        <a  v-if="this.selectedFile.isDir"
                            href="#"
                            @click.prevent="$modal.show('uploadFile', {isFolder: true, isEditing: true})">

                            <i class="fa fa-pen"></i> Edit
                        </a>
                        <a  v-else
                            href="#"
                            @click.prevent="$modal.show('uploadFile', {isFolder: false, isEditing: true})">
                            <i class="fa fa-pen"></i> Edit
                        </a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="deleteFile">
                            <i class="fa fa-trash"></i> Delete
                        </a>
                    </li>

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
    import Barcode from './Barcode';
    import MoveFile from './MoveFile';
    import swal from 'sweetalert2';

    export default {
        components: {
            DriveTable,
            UploadFile,
            NewFolder,
            Barcode,
            MoveFile,
        },
        async beforeRouteEnter(to, from, next) {
            let folderId = 1;
            if(store.getters.folder && store.getters.folder.fileId) {
                folderId = store.getters.folder.fileId;
            }

            try {
                await store.dispatch('retrieveFolder', folderId);
                next();
            } catch (err) {
                await store.dispatch('retrieveFolder', 1);
            }

        },
        computed: {
            selectedFile() {
                return store.getters.selectedFile;
            },
            showOptions() {
                return typeof this.selectedFile !== 'undefined' && typeof this.selectedFile.fileId !== 'undefined';
            }
        },
        data() {
            return {
                searchKeyWord: '',
                searchTypes: ['name', 'serialNbr'],
            };
        },
        async mounted() {
            await store.dispatch('retrieveLoggedUser');
        },
        methods: {
            async search(str, searchTypes) {
                if (str.trim().length >= 2) {

                    if (typeof str === 'undefined') {
                        str = '';
                    }
                    if (searchTypes.length === 0) {
                        searchTypes = [ 'name', 'serialNbr'];
                    }
                    let searchPara = {
                        keywords: str,
                        types: searchTypes,
                    };
                    await store.dispatch('search', searchPara);
                }
                store.commit('SET_KEYWORD', str);


            },
            manageRights() {
                this.$modal.show('fileAuth', this.selectedFile);
            },
            openFile() {
                if (this.selectedFile.type === 'folder') {
                    this.loading = true;
                    store.dispatch('retrieveFolder', this.selectedFile.fileId)
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
                driveApi.downloadFile(this.selectedFile.fileId);
            },
            editFile() {
                if (!this.selectedFile.type === 'folder')
                    this.$modal.show('editFile');
            },

            deleteFile() {
                /*swal({
                    title: 'Delete this file?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#E74D3C',
                    cancelButtonColor: '#7A7A7A',
                    confirmButtonText: 'Delete'
                }).then(_ => {
                    async () => {
                        await driveApi.deleteFile(this.selectedFile.fileId);
                        await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                        await store.dispatch('unselectFile');
                    };
                });*/
                this.$modal.show('dialog', {
                    title: 'Are you sure?',
                    text: 'You will delete ' + this.selectedFile.name + ' from the IPSA ONE drive.',
                    buttons: [
                        {
                            title: 'Delete it',
                            default: true,
                            handler: async () => {
                                await driveApi.deleteFile(this.selectedFile.fileId);
                                await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                                await store.dispatch('unselectFile');
                                this.$modal.hide('dialog');
                            }
                        },
                        {
                            title: 'Close'
                        }
                    ]
                });
            },
            refreshFolder() {
                store.dispatch('retrieveFolder', store.getters.folder.fileId);
            }
        }
    };
</script>
