<template>
    <modal name="newFolder" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>New folder</h1>

            <form @submit.prevent="onSubmit">
                <input type="text" placeholder="Name" v-model="name">

                <!--
                <div name="managePermissions" height="auto" :scrollable="true">
                        <div class="big-wrapper">
                            <h2> Manage Permissions </h2>
                            <div class="file-information">
                                <h4> Folder information </h4>
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
                            </div>
                        </div>
                </div>
                -->






                <input type="submit" @click.prevent="onSubmit" value="Create" class="button success">
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
                name: ''
            };
        },
        methods: {
            async onSubmit() {
                const data = {
                    name: this.name,
                    isDir: true,
                    ownerId: store.getters.loggedUserId,
                    dirId: store.getters.folder.fileId,
                    groupId: 1,
                    allRead: 1,
                    allWrite: 1,
                    groupRead: 1,
                    groupWrite: 1,
                    ownerWrite: 1,
                    ownerRead: 1,
                };

                if (this.name.trim() !== '' & store.getters.loggedUser.groups.length !== 0){
                    await driveApi.uploadFile(data);
                    await this.$modal.hide('newFolder');
                    await store.dispatch('retrieveFolder', store.getters.folder.fileId);
                } else if (this.name.trim() == '') {
                    this.$notify({
                        type: 'error',
                        title: 'invalid name',
                        text: 'folder name must not be empty',
                        duration: -1
                    });
                } else {
                    this.$notify({
                        type: 'error',
                        title: 'No assigned group',
                        text: 'You must be in a group to create a folder.',
                        duration: -1
                    });
                }
            }
        }
    };
</script>
