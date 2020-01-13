<template>
    <section class="drive basic-layout">
        <upload-file />
        <barcode />
        <move-file />

        <section class="content">
            <h1 class="color-green section-title">
                Drive
            </h1>
            <drive-table
                :search="searchKeyWord"
                show-history="false"
            />
        </section>

        <section class="actions">
            <h1 class="section-title">
                Actions
            </h1>
            <ul>
                <li
                    v-if="loggedUser.groups && loggedUser.groups.length !== 0"
                    id="barre"
                >
                    <a
                        href="#"
                        @input="search(searchKeyWord, searchTypes)"
                    >
                        <i
                            class="fas fa-search"
                            aria-hidden="true"
                        />
                        <input
                            v-model="searchKeyWord"
                            class="search"
                            style="padding: 0; margin: 0;"
                            type="search"
                        >
                    </a>
                    <div
                        v-if="searchKeyWord && searchKeyWord.length > 0"
                        class="search_options"
                    >
                        <input
                            v-model="searchTypes"
                            type="checkbox"
                            value="name"
                            @change="search(searchKeyWord, searchTypes)"
                        >Name
                        <input
                            v-model="searchTypes"
                            type="checkbox"
                            value="serialNbr"
                            @change="search(searchKeyWord, searchTypes)"
                        >Serial number
                    </div>
                </li>
                <li v-if="loggedUser.groups && loggedUser.groups.length !== 0">
                    <a
                        href="#"
                        @click.prevent="$modal.show('uploadFile', {isDir: false, isEditing: false, loggedUser})"
                    >
                        <i
                            class="fa fa-upload"
                            aria-hidden="true"
                        /> Upload
                    </a>
                </li>

                <li v-if="loggedUser.groups && loggedUser.groups.length !== 0">
                    <a
                        href="#"
                        @click.prevent="$modal.show('uploadFile', {isDir: true, isEditing: false, loggedUser})"
                    >
                        <i
                            class="fa fa-plus"
                            aria-hidden="true"
                        /> New folder
                    </a>
                </li>

                <li style="padding-right: 15px !important">
                    <p
                        v-if="loggedUser.groups && loggedUser.groups.length == 0"
                        style="margin-right: 160px; word-break: break-word;"
                    >
                        Join a group to be able to upload files and create folders !
                    </p>
                </li>

                <li>
                    <a
                        href="#"
                        @click.prevent="newBarcode"
                    >
                        <i class="fa fa-barcode" /> Generate a new barcode
                    </a>
                </li>
            </ul>

            <br>

            <div v-if="showOptions">
                <h1 class="section-title">
                    Options
                </h1>
                <ul>
                    <li v-if="this.selectedFile && !this.selectedFile.file.isDir">
                        <a
                            v-if="!showHistory"
                            href="#"
                            @click.prevent="downloadFile"
                        >
                            <i
                                class="fa fa-download"
                                aria-hidden="true"
                            /> Download
                        </a>
                        <a
                            v-else
                            href="#"
                            @click.prevent="downloadRev"
                        >
                            <i
                                class="fa fa-download"
                                aria-hidden="true"
                            /> Download
                        </a>
                    </li>
                    <li v-else-if="this.selectedFile">
                        <a
                            href="#"
                            @click.prevent="openFile"
                        >
                            <i
                                class="fa fa-download"
                                aria-hidden="true"
                            /> Open
                        </a>
                    </li>

                    <li v-if="this.selectedFile.file && !this.selectedFile.file.isDir">
                        <a
                            v-if="!showHistory"
                            href="#"
                            @click.prevent="toggleShowHistory"
                        >
                            <i
                                v-if="!showHistory"
                                class="fas fa-history"
                            /> Show history
                        </a>
                        <a
                            v-else
                            href="#"
                            @click.prevent="toggleShowHistory"
                        >
                            <i
                                v-if="showHistory"
                                class="fas fa-times"
                            /> Hide history
                        </a>
                    </li>
                    <!--li>
                        <a href="#" @click.prevent="downloadMeta">
                            <i></i> Download Meta
                        </a>
                    </li-->
                    <li v-if="!showHistory">
                        <a href="#" @click.prevent="moveFile">
                            <i
                                class="fa fa-folder"
                                aria-hidden="true"
                            /> Move
                        </a>
                    </li>
                    <li v-if="!showHistory">
                        <a
                            v-if="this.selectedFile.isDir"
                            href="#"
                            @click.prevent="$modal.show('uploadFile', {isDir: true, isEditing: true})"
                        >

                            <i class="fa fa-pen" /> Edit
                        </a>
                        <a
                            v-else
                            href="#"
                            @click.prevent="$modal.show('uploadFile', {isDir: false, isEditing: true})"
                        >
                            <i class="fa fa-pen" /> Edit
                        </a>
                    </li>
                    <li v-if="!showHistory">
                        <a
                            href="#"
                            @click.prevent="deleteFile"
                        >
                            <i class="fa fa-trash" /> Delete
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
import Barcode from './Barcode';
import MoveFile from './MoveFilev2';

export default {
    components: {
        DriveTable,
        UploadFile,
        Barcode,
        MoveFile
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
    data() {
        return {
            searchKeyWord: '',
            searchTypes: ['name', 'serialNbr'],
        };
    },
    computed: {
        selectedFile() {
            return store.getters.selectedFile;
        },
        showOptions() {
            return typeof this.selectedFile !== 'undefined' && typeof this.selectedFile.fileId !== 'undefined' || this.showHistory;
        },
        showHistory() {
            return store.getters.showHistory;
        },
        loggedUser() {
            return store.getters.loggedUser;
        }
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
        openFile() {
            if (this.selectedFile.type === 'folder') {
                this.loading = true;
                store.dispatch('retrieveFolder', this.selectedFile.fileId)
                    .then(() => store.dispatch('selectFile', {}))
                    .then(() => this.loading = false);
            }
        },
        moveFile() {
            this.$modal.show('moveFile', {file: this.selectedFile});
        },
        newBarcode() {
            this.$modal.show('barcode');
        },
        downloadFile() {
            driveApi.downloadFile(this.selectedFile.fileId);
        },
        downloadRev() {
            driveApi.downloadRev(this.selectedFile.fileId, this.selectedFile.id);
        },
        // downloadMeta() {
        //     driveApi.downloadMeta(this.selectedFile.fileId);
        // },
        editFile() {
            if (!this.selectedFile.type === 'folder')
                this.$modal.show('editFile');
        },
        toggleShowHistory() {
            if(!store.getters.showHistory){
                store.dispatch('showHistory', this.selectedFile.fileId);
            } else {
                store.dispatch('hideHistory');
            }
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
