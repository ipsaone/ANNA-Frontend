<template>
    <modal name="uploadFile" height="auto" :scrollable="true"  @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1 v-if="isFolder && !isEditing">Create a new folder</h1>
            <h1 v-if="isFolder && isEditing">Edit selected folder</h1>
            <h1 v-if="!isFolder && !isEditing">Upload a new file</h1>
            <h1 v-if="!isFolder && isEditing">Edit selected file</h1>
            <form @submit.prevent="onSubmit">
                <input v-if="!isFolder && !isEditing" type="file" ref="file" @change="onFileChange">
                <vm-progress v-if="!isFolder && !isEditing" max="100" :text-inside="true" :stroke-width="18" :percentage="uploadPercentage"></vm-progress>
                <input v-if="isFolder && !isEditing" type="text" autocomplete="off" v-model="name" placeholder="Folder name">
                <input v-if="isFolder && isEditing" type="text" autocomplete="off" v-model="name">
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
                                    <datalist id="users" autocomplete="off">
                                        <option v-for="user in users" :key="user.id" :value="user.username" :label="user.username"/>
                                    </datalist>
                                    <datalist id="groups" autocomplete="off">
                                        <option v-for="group in userGroups" :key="group.id" :value="group.name" :label="group.name"/>
                                    </datalist>

                                    <li v-if="!isFolder"><label>Serial number : </label><input type="text" v-model="serialNbr"/></li>

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
                isFolder: '',
                isEditing: '',
                file: '',
                name: '',
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
                },
                serialNbr: '',
                uploadPercentage: 0
            };
        },
        computed : {
            users() {
                return store.getters.users;
            },
            user() {
                return store.getters.selectedUser;
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
            },
            selectedFile() {
                return store.getters.selectedFile;
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
                            if (this.selectedGroup.users[i].id == this.ownerId) {
                                contains = true;
                            }
                            else {
                                // console.log('contient pas');
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
            async setGroupId(name) {
                let groupId = this.userGroups.find(myGroup => myGroup.name == name).id;
                this.groupId = groupId;
                if (this.ownerName.trim() != '') {
                    await store.dispatch('retrieveGroup', this.groupId);
                    let i = 0;
                    let contains = false;
                    while (i < this.selectedGroup.users.length) {
                        if (this.selectedGroup.users[i].id == this.ownerId) {
                            contains = true;
                        }
                        else {
                            // console.log('contient pas');
                        }
                        i++;
                    };
                    if (contains === false) {
                        this.groupName = '';
                        this.groupId = '';
                        this.$notify({
                            type: 'warning',
                            title: 'Owner doesn\'t belong to this group',
                            text: 'Please change owner or group',
                            duration: 5000
                        });
                    }
                }
            },
            onFileChange(e) {
                const files = e.target.files || e.dataTransfer.files;
                if (files.length > 0) this.file = files[0];
            },
            async onSubmit() {

                let data = {
                    ownerId: parseInt(this.ownerId, 10),
                    dirId: store.getters.folder.fileId,
                    groupId: parseInt(this.groupId, 10),
                    allRead: this.rights.allRead,
                    allWrite: this.rights.allWrite,
                    groupRead: this.rights.groupRead,
                    groupWrite: this.rights.groupWrite,
                    ownerWrite: this.rights.ownerWrite,
                    ownerRead: this.rights.ownerRead,
                    serialNbr: this.serialNbr
                };

                if (this.file === '' && this.name.trim() === '') {
                    this.$notify({
                        type: 'error',
                        title: 'No file selected',
                        text: 'What file do you even want to upload ?',
                        duration: 5000
                    });
                    return false;
                }

                if(this.isFolder) {
                    data.name = this.name;
                    data.isDir = true;
                } else {
                    data.contents = this.file;
                    data.name = this.file.name;
                }

                if (this.ownerId === '' || this.groupId === '') {
                    this.$notify({
                        type: 'error',
                        title: 'No owner or group',
                        text: 'Please fill the owner and group inputs',
                        duration: 5000
                    });
                    return false;
                }

                if (this.rights.groupWrite != true && this.rights.ownerWrite != true && this.rights.allWrite !=true) {
                    let confirmation = confirm('Do you still want to upload without write permissions ?');
                    if (confirmation === true) {
                        document.getElementById('submitButton').setAttribute('disabled', 'disabled');
                        if(!this.isEditing)
                            await driveApi.uploadFile(data);
                        else
                            await driveApi.editFile({fileId: this.selectedFile.fileId, data});
                        document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                        await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                        await store.dispatch('resetProgress');
                        this.$modal.hide('uploadFile');
                    }
                } else {
                    document.getElementById('submitButton').setAttribute('disabled', 'disabled');
                    if(!this.isEditing)
                        await driveApi.uploadFile(data);
                    else
                        await driveApi.editFile({fileId: this.selectedFile.fileId, data})
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
            async cancelUpload() {
                this.file = '';
                this.contents = '';
                this.ownerId = '';
                this.ownerName = '';
                this.groupId = '';
                this.groupName  = '';
                this.name = '';
                this.serialNbr = '';
                await driveApi.cancelUpload();
                this.$modal.hide('uploadFile');
            },
            async beforeOpen(event) {
                if (event && event.params && event.params.isEditing) {
                    this.ownerId = this.selectedFile.owner.id;
                    this.ownerName = this.selectedFile.owner.username;
                    this.groupId = this.selectedFile.groupId;
                    await store.dispatch('retrieveGroup', this.groupId);
                    this.groupName = this.selectedGroup.name;
                    this.name = this.selectedFile.name;
                    this.serialNbr = this.selectedFile.serialNbr;
                } else {
                    let user = store.getters.loggedUser;
                    let group = store.getters.groups.sort((a, b) => a.id - b.id)[0];
                    this.ownerId = user.id;
                    this.ownerName = user.username;
                    this.groupId = group.id;
                    this.groupName = group.name;
                    this.name = '';
                    this.serialNbr = '';
                }

                this.isEditing = event.params.isEditing;
                this.isFolder = event.params.isFolder;
                await store.dispatch('retrieveLoggedUser');
            }
        }
    };
</script>
