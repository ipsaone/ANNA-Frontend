<template>
    <modal name="editFile" @before-open="beforeOpen" @before-close="beforeClose" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Edit {{ file.name }}</h1>
            <form @submit.prevent="onSubmit">
                <input type="file" @change="onFileChange">
                <label for="folders">Move: </label>
                <select name="folders" id="folders" v-model="selectedFolder">
                    <option v-for="el in formatedFoldersList" :value="el.id" >{{ el.name }}</option>
                </select>
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
                file: '',
                folders: {},
                selectedFolder: '',
                target: []
            };
        },
        computed: {
            formatedFoldersList() {
                this.formatList(this.folders, this.target);
                this.target.reverse();
                return this.target;
            },
        },
        methods: {
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length > 0) this.file = files[0];
            },
            beforeOpen(event) {
                this.file = store.getters.selectedFile;
                store.dispatch('getFoldersList')
                    .then(list => {
                        this.folders = list['data'];
                    });
            },
            beforeClose(event) {
                this.target = [];
                this.selectedFolder = '';
                store.dispatch('unselectFile');
            },
            onSubmit() {
                console.log(this.selectedFolder);
                const data = {
                    fileId: store.getters.selectedFile.id,
                    contents: this.file,
                    folderId: this.selectedFolder
                };

                driveApi.editFile(data)
                    .then(store.dispatch('retrieveFolder', store.getters.folder.id))
                    .then(this.$modal.hide('editFile'))
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'Uncaught error',
                            text: err.message,
                            duration: -1
                        });
                    });
            },
            formatList(list, target, level = 0) {
                if ('children' in list) {
                    for (let i = 0; i < list.children.length; ++i) {
                        this.formatList(list.children[i], target, ++level);
                        --level;
                    }
                    delete list['children'];
                }
                if (list.name !== undefined) {
                    list.name = '+'.repeat(level) + ' ' + list.name;
                    target.push(list);
                }
            }
        }
    };
</script>