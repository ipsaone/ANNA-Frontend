<template>
    <modal name="uploadFile" height="auto" :scrollable="true"  @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Upload a new file</h1>
            <form @submit.prevent="onSubmit">
                <input type="file" ref="file" @change="onFileChange">
                <vm-progress max="100" :text-inside="true" :stroke-width="18" :percentage="uploadPercentage"></vm-progress>
                <div name="managePermissions" height="auto" :scrollable="true">
                        <div class="big-wrapper">
                            <h2> Manage Permissions </h2>
                            <div class="file-information">
                                <h4> File information </h4>
                                <ul>
                                    <li><label for="owner-input">Owner : </label> <input id="owner-input" list="users" type="text" name="owner" value="" v-model="ownerName" autocomplete="off" @change="selectUser(ownerName)"></li>
                                    <li>
                                        <label v-if="userGroups.length != 0" for="group-input">Group : </label> <input id="group-input" v-if="userGroups.length != 0" list="groups" type="text" name="group" value="" v-model="groupName" autocomplete="off" @change="setGroupId(groupName)">
                                        <label id="replace" v-if="userGroups.length == 0" for="group-input">User has no group. Owners need to be in a group</label>
                                    </li>
                                    <datalist id="users">
                                        <option v-for="user in users" :key="user.id" :value="user.username" :label="user.username"/>
                                    </datalist>
                                    <datalist id="groups">
                                        <option v-for="group in userGroups" :key="group.id" :value="group.name" :label="group.name"/>
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
                                    <button type="button"class="cancel" @click="cancelUpload"> Cancel </button>
                                    <button id="submitButton" type="submit" class="button success">Submit</button>
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
                ownerId: '',
                ownerName: '',
                groupName: '',
                groupId: '',
                rights: {
                    ownerRead: true,
                    ownerWrite: true,
                    groupRead: true,
                    groupWrite: true,
                    allRead: true,
                    allWrite: true
                }
            };
        },
        computed : {
            users() {
                return store.getters.users;
            },
            user() {
                return store.getters.selectedUser;
            },
            uploadPercentage() {
                return store.getters.progress;
            },
            selectedUser() {
                return store.getters.selectedUser;
            },
            cases() {
                return Array('ownerRead', 'groupRead', 'allRead', 'ownerWrite', 'groupWrite', 'allWrite');
            },
            userGroups() {
                return store.getters.selectedUser.groups;
            },
            selectedGroup() {
                return store.getters.selectedGroup;
            }
        },
        methods: {
            handleFileUpload() {
                this.file = this.$refs.file.files[0];
            },
            async selectUser(name) {
                if(name.trim() != '') {
                    let ownerId =  this.users.find(myUser => myUser.username == name).id;
                    await store.dispatch('selectUser', ownerId);
                    this.ownerId = ownerId;
                    if (this.groupName.trim() != '') {
                        await store.dispatch('retrieveGroup', this.groupId);
                        let i = 0;
                        let contains = false;
                        while (i < this.selectedGroup.users.length) {
                            console.log(this.selectedGroup.users[i]);
                            if (this.selectedGroup.users[i].id == this.ownerId) {
                                console.log('contient');
                                contains = true;
                            }
                            else {
                                console.log('contient pas');
                            }
                            i++;
                        };
                        if (contains === false) {
                            this.groupName = '';
                            this.groupId = '';
                        }
                    }
                } else {
                    this.ownerId = '';
                    this.ownerName = '';
                }
            },
            setGroupId(name) {
                let groupId = this.userGroups.find(myGroup => myGroup.name == name).id;
                this.groupId = groupId;
            },
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

                if (this.file === '') {
                    this.$notify({
                        type: 'error',
                        title: 'No file selected',
                        text: 'What file do you even want to upload ?',
                        duration: 5000
                    });
                    return 0;
                }

                if (this.ownerId === '' || this.groupId === '') {
                    this.$notify({
                        type: 'error',
                        title: 'No owner or group',
                        text: 'Please fill the owner and group inputs',
                        duration: 5000
                    });
                    return 0;
                }

                if (this.rights.groupWrite != true && this.rights.ownerWrite != true && this.rights.allWrite !=true) {
                    let confirmation = confirm('Do you still want to upload without write permissions ?');
                    if (confirmation === true) {
                        document.getElementById('submitButton').setAttribute('disabled', 'disabled');
                        await driveApi.uploadFile(data);
                        this.uploadPercentage = store.getters.progress;
                        document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                        await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                        await store.dispatch('resetProgress');
                        this.$modal.hide('uploadFile');
                    } else {
                        return 0;
                    }
                } else {
                    document.getElementById('submitButton').setAttribute('disabled', 'disabled');
                    await driveApi.uploadFile(data)
                    .then(() => this.$notify({
                        type: 'success',
                        title: 'File successfully uploaded',
                        text: '',
                        duration: 5000
                    }))
                    .catch(() => console.log('Upload successfully canceled'));

                    document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                    await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                    await store.dispatch('resetProgress');
                    this.$modal.hide('uploadFile');
                    // window.location.reload();

                }


            },
            selectedFileId() {
                return store.getters.selectFileId;
            },
            async cancelUpload() {
                this.file = '';
                this.contents = '';
                this.ownerId = '';
                this.ownerName = '';
                this.groupId = '';
                this.groupName  = '';
                await driveApi.cancelUpload();
                this.$modal.hide('uploadFile');
            },
            async beforeOpen() {
                await store.dispatch('retrieveLoggedUser');
            }
        }
    };
</script>
