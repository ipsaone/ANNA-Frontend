<template>
  <modal
    name="uploadFile"
    height="auto"
    :scrollable="true"
    @before-open="beforeOpen"
  >
    <div
      id="upload-file"
      class="content anna-modal"
    >
      <!-- TITLE -->
      <h1 v-if="isDir && !isEditing">
        Create a new folder
      </h1>
      <h1 v-if="isDir && isEditing">
        Edit selected folder
      </h1>
      <h1 v-if="!isDir && !isEditing">
        Upload a new file
      </h1>
      <h1 v-if="!isDir && isEditing">
        Edit selected file
      </h1>
      <form @submit.prevent="onSubmit">
        <input
          v-if="!isDir && !isEditing"
          ref="file"
          type="file"
          @change="onFileChange"
        >
        <vm-progress
          v-if="!isDir && !isEditing"
          max="100"
          :text-inside="true"
          :stroke-width="18"
          :percentage="uploadPercentage"
        />
        <input
          v-if="isDir && !isEditing"
          v-model="name"
          type="text"
          autocomplete="off"
          placeholder="Folder name"
        >
        <input
          v-if="isDir && isEditing"
          v-model="name"
          type="text"
          autocomplete="off"
        >
        <div
          name="managePermissions"
          height="auto"
          :scrollable="true"
        >
          <div class="big-wrapper">
            <h2 id="manage-permissions">
              Manage Permissions
            </h2>
            <div class="file-information">
              <h4> File information </h4>
              <ul>
                <li>
                  <label for="owner-input">Owner : </label> <input
                    id="owner-input"
                    v-model="ownerName"
                    list="users"
                    type="text"
                    name="owner"
                    value=""
                    autocomplete="off"
                    @change="selectUser(ownerName)"
                  >
                </li>
                <li>
                  <label
                    v-if="userGroups"
                    for="group-input"
                  >Group : </label> <input
                    v-if="userGroups"
                    id="group-input"
                    v-model="groupName"
                    list="groups"
                    type="text"
                    name="group"
                    value=""
                    autocomplete="off"
                    @change="setGroupId(groupName)"
                  >
                  <label
                    v-if="!userGroups"
                    id="replace"
                    for="group-input"
                  >User has no group. Owners need to be in a group</label>
                </li>
                <datalist
                  id="users"
                  autocomplete="off"
                >
                  <option
                    v-for="user in users"
                    :key="user.id"
                    :value="user.username"
                    :label="user.username"
                  />
                </datalist>
                <datalist
                  id="groups"
                  autocomplete="off"
                >
                  <option
                    v-for="group in userGroups"
                    :key="group.id"
                    :value="group.name"
                    :label="group.name"
                  />
                </datalist>

                <li v-if="!isDir">
                  <label>Serial number : </label><input
                    v-model="serialNbr"
                    type="text"
                  >
                </li>
              </ul>
            </div>
            <div class="permissions">
              <h4> Permissions </h4>
              <div class="tableau-permissions">
                <div
                  id="diagonale"
                  class="case"
                >
                  \
                </div>
                <div
                  id="owner"
                  class="case"
                >
                  owner
                </div>
                <div
                  id="group"
                  class="case"
                >
                  group
                </div>
                <div
                  id="others"
                  class="case"
                >
                  others
                </div>
                <div
                  id="read"
                  class="case"
                >
                  read
                </div>
                <div
                  id="write"
                  class="case"
                >
                  write
                </div>
                <div
                  v-for="box in cases"
                  class="case cochable"
                >
                  <div class="checkbox-container">
                    <input
                      :id="box"
                      v-model="rights[box]"
                      type="checkbox"
                      :name="box"
                    >
                    <label
                      class="checkbox"
                      :for="box"
                    />
                  </div>
                </div>
              </div>
              <div class="buttons">
                <button
                  type="button"
                  class="cancel"
                  @click="cancelUpload"
                >
                  Cancel
                </button>
                <button
                  id="submitButton"
                  type="submit"
                  class="button success"
                >
                  Submit
                </button>
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
            isDir: '',
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
        };
    },
    computed: {
        users() {
            return store.getters.users;
        },
        // user() {
        //     return store.getters.selectedUser;
        // },
        selectedUser: {
            get: function () {
                return store.getters.selectedUser;
            },
            set: function () {
                var selectedUser = {};
            }
        },
        cases() {
            return Array('ownerRead', 'groupRead', 'allRead', 'ownerWrite', 'groupWrite', 'allWrite');
        },
        folder() {
            return store.getters.folder;
        },
        uploadPercentage: {
            get: function () {
                return store.getters.progress;
            },
            set: function () {
                var uploadPercentage = 0;
            }
        },
        userGroups: {
            get: function () {
                if (store.getters.selectedUser)
                    return store.getters.selectedUser.groups;
                else
                    return store.getters.loggedUser.groups;
            },
            set: function () {
                var userGroups = Array();
            }
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
                let ownerId;
                if(this.users.find(myUser => myUser.username == name)) {
                    ownerId =  this.users.find(myUser => myUser.username == name).id;
                } else {
                    return false;
                }
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
                    }
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
            let groupId;
            if (this.userGroups.find(myGroup => myGroup.name == name)) {
                groupId = this.userGroups.find(myGroup => myGroup.name == name).id;
            } else {
                return false;
            }
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
                }
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
            let interrupt = false;
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

            if(this.isDir) {
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
                    if (this.isEditing) {
                        await driveApi.editFile({fileId: this.selectedFile.fileId, data})
                            .catch(_ => {
                                interrupt = true;
                                if(document.getElementById('submitButton')) {
                                    document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                                }
                            });
                    } else {
                        let alreadyExists = false;
                        if(this.isDir) {
                            this.folder.children.forEach(child => {
                                if(child.name == data.name) {
                                    alreadyExists = true;
                                }
                            });
                            if(alreadyExists) {
                                this.$notify({
                                    type: 'warning',
                                    title: 'A folder with this name already exists',
                                    text: 'Please change folder name',
                                    duration: 5000
                                });
                            } else {
                                await driveApi.uploadFile(data)
                                    .catch(_ => {
                                        interrupt = true;
                                        if(document.getElementById('submitButton')) {
                                            document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                                        }
                                    });
                                this.uploadPercentage = store.getters.progress;
                            }
                        } else {
                            let editingFileid;
                            this.folder.children.forEach(child => {
                                if(child.name == data.name) {
                                    alreadyExists = true;
                                    editingFileid = child.fileId;
                                }
                            });
                            if(alreadyExists) {
                                let confirmation = confirm('A file with the name '
                                    + data.name + ' already exists. \nContinuing will upload a new version of the file.');
                                if (confirmation === true) {
                                    document.getElementById('submitButton').setAttribute('disabled', 'disabled');
                                    await driveApi.editFile({fileId: editingFileid, data})
                                        .catch(_ => {
                                            interrupt = true;
                                            if(document.getElementById('submitButton')) {
                                                document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                                            }
                                        });
                                    this.uploadPercentage = store.getters.progress;
                                } else {
                                    interrupt = true;
                                }
                            } else {
                                await driveApi.uploadFile(data)
                                    .catch(_ => {
                                        interrupt = true;
                                        if(document.getElementById('submitButton')) {
                                            document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                                        }
                                    });
                                await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                                this.uploadPercentage = store.getters.progress;
                            }
                        }
                    }
                    document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                    await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                    await store.dispatch('resetProgress');
                    if (!interrupt) {
                        this.$modal.hide('uploadFile');
                    }
                }
            } else {
                document.getElementById('submitButton').setAttribute('disabled', 'disabled');
                if (this.isEditing) {
                    await driveApi.editFile({fileId: this.selectedFile.fileId, data})
                        .catch(_ => {
                            interrupt = true;
                            if(document.getElementById('submitButton')) {
                                document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                            }
                        });
                } else {
                    let alreadyExists = false;
                    if(this.isDir) {
                        this.folder.children.forEach(child => {
                            if(child.name == data.name) {
                                alreadyExists = true;
                            }
                        });
                        if(alreadyExists) {
                            this.$notify({
                                type: 'warning',
                                title: 'A folder with this name already exists',
                                text: 'Please change folder name',
                                duration: 5000
                            });
                        } else {
                            await driveApi.uploadFile(data)
                                .catch(_ => {
                                    interrupt = true;
                                    if(document.getElementById('submitButton')) {
                                        document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                                    }
                                });
                            this.uploadPercentage = store.getters.progress;
                        }
                    } else {
                        let editingFileid;
                        this.folder.children.forEach(child => {
                            if(child.name == data.name) {
                                alreadyExists = true;
                                editingFileid = child.fileId;
                            }
                        });
                        if(alreadyExists) {
                            let confirmation = confirm('A file with the name '
                                + data.name + ' already exists. \nContinuing will upload a new version of the file.');
                            if (confirmation === true) {
                                document.getElementById('submitButton').setAttribute('disabled', 'disabled');
                                await driveApi.editFile({fileId: editingFileid, data})
                                    .catch(_ => {
                                        interrupt = true;
                                        if(document.getElementById('submitButton')) {
                                            document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                                        }
                                    });
                                this.uploadPercentage = store.getters.progress;
                            } else {
                                interrupt = true;
                            }
                        } else {
                            await driveApi.uploadFile(data)
                                .catch(_ => {
                                    interrupt = true;
                                    if(document.getElementById('submitButton')) {
                                        document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                                    }
                                });
                            await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                            this.uploadPercentage = store.getters.progress;
                        }
                    }
                }
                if(document.getElementById('submitButton')) {
                    document.getElementById('submitButton').removeAttribute('disabled', 'disabled');
                }
                await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                await store.dispatch('resetProgress');
                if (!interrupt) {
                    this.$modal.hide('uploadFile');
                }
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
            await store.dispatch('resetProgress');
            this.$modal.hide('uploadFile');
        },
        async beforeOpen(event) {
            await store.dispatch('retrieveUsers');
            await store.dispatch('retrieveGroups');
            if (event && event.params && event.params.isEditing) {
                this.ownerId = this.selectedFile.ownerId;
                this.ownerName = this.selectedFile.owner.username;
                this.groupId = this.selectedFile.groupId;
                await store.dispatch('retrieveGroup', this.groupId);
                this.groupName = this.selectedGroup.name;
                this.name = this.selectedFile.name;
                this.serialNbr = this.selectedFile.serialNbr;
                this.rights = this.selectedFile.rights;
            } else {
                let user = event.params.loggedUser;
                let group = event.params.loggedUser.groups.sort((a, b) => a.id - b.id)[0];
                this.ownerId = user.id;
                this.ownerName = user.username;
                this.groupId = group.id;
                this.groupName = group.name;
                this.name = '';
                this.serialNbr = '';
                this.rights = { ownerRead: true,
                    ownerWrite: true,
                    groupRead: true,
                    groupWrite: true,
                    allRead: true,
                    allWrite: true
                };
            }

            this.isEditing = event.params.isEditing;
            this.isDir = event.params.isDir;
            await store.dispatch('retrieveLoggedUser');
        }
    }
};
</script>
