<template>
    <modal name="managePermissions" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <div class="big-wrapper">
                <h2> Edit permissions </h2>
                <div class="file-information">
                    <h4> File information </h4>
                    <ul>
                        <li>Owner : <router-link :to="{name: 'profile',
                            params:{id: selectedFile.owner.id}}">
                            {{selectedFile.owner.username}}
                                    </router-link>
                        </li>
                        <li>Group : {{selectedFileGroup.name}} </li>
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
                        <button type="button"class="cancel" @click="$modal.hide('managePermissions')"> Cancel </button>
                        <button type="button" class="submit" @click="updatePermission()"> Confirm </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
    import store from '@/modules/store';
    import driveApi from '@/modules/drive/drive_api';

    export default {
        computed : {
            cases() {
                return Array('ownerRead', 'groupRead', 'allRead', 'ownerWrite', 'groupWrite', 'allWrite');
            },
            selectedFile() {
                return store.getters.selectedFile;
            },
            selectedFileGroup() {
                //store.dispatch('retrieveGroup', this.selectedFile.groupId);
                return store.getters.selectedGroup;
            },
            loggedUser() {
                return store.getters.loggedUser;
            },
            loggedUserId() {
                return store.getters.loggedUserId;
            },
            fileRights() {
                return store.getters.selectedFile.rights;
            }
        },
        data() {
            return {
                contents: '',
                fileId: 1,
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
        methods : {
            selectedFileId() {
                return store.getters.selectFileId;
            },
            updatePermission() {
                driveApi.editFile({
                    fileId: this.fileId,
                    data: {
                        ownerRead: this.rights.ownerRead,
                        ownerWrite: this.rights.ownerWrite,
                        groupRead: this.rights.groupRead,
                        groupWrite: this.rights.groupWrite,
                        allRead: this.rights.allRead,
                        allWrite: this.rights.allWrite
                    }
                });
            },
            async beforeOpen() {
                await store.dispatch('retrieveLoggedUser');
                this.file = this.selectedFile;
                this.fileId = this.selectedFile.id;
                this.rights = this.fileRights;
                /*let opts = ['owner', 'group', 'all'];
                let opts2 = ['Read', 'Write'];
                for (let key1 in opts) {
                    for (let key2 in opts2) {
                        let truc = opts[key1] + opts2[key2];
                        if (this.fileRights[truc] === true) {
                            document.getElementById(truc).checked = true;
                        }
                        else {
                            document.getElementById(truc).checked = false;
                        }
                    }
                }*/
            }
        }
    };
</script>
