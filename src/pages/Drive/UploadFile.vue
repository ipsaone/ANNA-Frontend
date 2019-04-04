<template>
    <modal name="uploadFile" height="auto" :scrollable="true"  @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Upload a new file</h1>
            <form @submit.prevent="onSubmit">
                <input type="file" @change="onFileChange">
                <div name="managePermissions" height="auto" :scrollable="true">
                        <div class="big-wrapper">
                            <h2> Manage Permissions </h2>
                            <div class="file-information">
                                <h4> File information </h4>
                                <ul>
                                    <li><label for="owner-input">Owner : </label> <input id="owner-input" list="users" type="text" name="owner" value="" v-model="ownerId"></li>
                                      <li><label for="group-input">Group : </label> <input id="group-input" list="groups" type="text" name="group" value="" v-model="groupId"></li>
                                    <datalist id="users">
                                        <option v-for="user in users" :key="user.id" :value="user.id" :label="user.username"/>
                                    </datalist>
                                    <datalist id="groups">
                                        <option v-for="group in groups" :key="group.id" :value="group.id" :label="group.name"/>
                                    </datalist>

                                </ul>
                            </div>
                            <div class="permissions">
                                <h4> Permissions </h4>
                                <div class="tableau-permissions">
                                    <div class="case" id="diagonale">\</div>
                                    <div class="case" id="owner">
                                        owner
                                    </div>
                                    <div class="case" id="group">
                                        group
                                    </div>
                                    <div class="case" id="others">
                                        others
                                    </div>
                                    <div class="case" id="read">
                                        read
                                    </div>
                                    <div class="case" id="write">
                                        write
                                    </div>
                                    <div v-for="box in cases" class="case cochable">
                                        <div class="checkbox-container">
                                            <input type="checkbox" :name="box" :id="box" v-model="rights[box]">
                                            <label class="checkbox" :for="box"></label>
                                        </div>
                                    </div>
                                </div>
                                <div class="buttons">
                                    <button type="button"class="cancel" @click="$modal.hide('uploadFile')"> Cancel </button>
                                    <button type="submit" class="button success">Submit</button>
                                </div>
                            </div>
                        </div>
                </div>

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
                contents: '',
                fileId: 1,
                ownerId: '',
                groupId: '',
                rights: {
                    ownerRead: false,
                    ownerWrite: false,
                    groupRead: false,
                    groupWrite: false,
                    allRead: false,
                    allWrite: false
                }
            };
        },
        computed : {
            users(){
                return store.getters.users;
            },
            groups(){
                return store.getters.groups;
            },
            cases() {
                return Array('ownerRead', 'groupRead', 'allRead', 'ownerWrite', 'groupWrite', 'allWrite');
            },
            loggedUser() {
                return store.getters.loggedUser;
            },
            loggedUserId() {
                return store.getters.loggedUserId;
            }
        },
        methods: {
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length > 0) this.file = files[0];
            },
            async onSubmit() {
                const data = {
                    contents: this.file,
                    name: this.file.name,
                    ownerId: parseInt(this.ownerId, 10),
                    dirId: store.getters.folder.fileId,
                    groupId: parseInt(this.groupId, 10),
                    allRead: this.rights.allRead,
                    allWrite: this.rights.allWrite,
                    groupRead: this.rights.groupRead,
                    groupWrite: this.rights.groupWrite,
                    ownerWrite: this.rights.ownerWrite,
                    ownerRead: this.rights.ownerRead,
                };

                await driveApi.uploadFile(data);
                await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                this.$modal.hide('uploadFile');

            },
            selectedFileId() {
                return store.getters.selectFileId;
            },
            async beforeOpen() {
                await store.dispatch('retrieveLoggedUser');
            }
        }
    };
</script>
