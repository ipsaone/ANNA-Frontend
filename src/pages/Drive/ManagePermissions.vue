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
                        <div v-for="number in cases" class="case cochable">
                            <div class="checkbox-container">
                                <input type="checkbox" :name="number" :id="cases.indexOf(number)" @click="updatePermission(selectedFile.id, number)">
                                <label class="checkbox" :for="cases.indexOf(number)"></label>
                            </div>
                        </div>
                    </div>
                    <div class="buttons">
                        <button type="button"class="cancel"> Cancel </button>
                        <button type="button" class="submit"> Confirm </button>
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
        async mounted() {
            await store.dispatch('retrieveLoggedUser');
        },
        computed : {
            cases() {
                return Array(1, 2, 3, 4, 5, 6);
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
            }
        },
        methods : {
            selectedFileId() {
                return store.getters.selectFileId;
            },
            updatePermission(fileId, number) {
                console.log('\n file id', fileId, '\n numéro de la case', number
                , '\n loggedUserId', this.loggedUserId);
            }
        }
    };
</script>
