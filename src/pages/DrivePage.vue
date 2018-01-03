<template>
    <section class="drive basic-layout">
        <upload-file></upload-file>
        <new-folder></new-folder>

        <section class="content">
            <h1 class="section-title">Drive</h1>

            <drive-table></drive-table>
        </section>

        <section class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li>
                    <a href="#" @click.prevent="$modal.show('uploadFile')"><i class="fa fa-upload" aria-hidden="true"></i> Upload</a>
                </li>

                <li>
                    <a href="#" @click.prevent="$modal.show('newFolder')"><i class="fa fa-plus" aria-hidden="true"></i> New folder</a>
                </li>
            </ul>

            <div v-if="showOptions">
                <h1 class="section-title">Options</h1>
                <ul>
                    <li v-if="!selectedFile.isDir">
                        <a href="#" @click.prevent="downloadFile"><i class="fa fa-download" aria-hidden="true"></i> Download</a>
                    </li>
                    <li><a href="#"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</a></li>
                    <li><a href="#"><i class="fa fa-trash"></i> Delete</a></li>
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

    export default {
        components: {
            DriveTable,
            UploadFile,
            NewFolder
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
                return typeof this.selectedFile.id !== 'undefined';
            }
        },
        methods: {
            downloadFile() {
                driveApi.downloadFile(this.selectedFile.id);
            },
            editFile() {

            },
            deleteFile() {

            }
        }
    };
</script>