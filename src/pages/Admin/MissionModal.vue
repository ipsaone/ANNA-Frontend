<template>
    <modal name="missionModal" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal missionModal">
            <h1 v-if="isEditing"> Edit mission </h1>
            <h1 v-else> New Mission </h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">
                <markdown-editor v-model="markdown" :configs="configs" class="md-editor"></markdown-editor>

                <div class="form-group">
                    <label for="leader">Leader: </label>
                    <input list="users" type="text" name="leader" id="leader" v-model="leaderName" autocomplete="off" @change="selectUser(leaderName)"><br/>
                    <!--label v-if="userGroups && userGroups.length != 0" for="group">Group: </label-->
                    <!--label v-else for="group">User has no group. Leaders need to be in a group.</label-->
                    <!--input v-if="userGroups && userGroups.length != 0" list="groups" type="text" name="groups" id="group" v-model="groupName" autocomplete="off" @change="setGroupId(groupName)"-->
                    <datalist id="users">
                        <option v-for="user in users" :key="user.id" :value="user.username" :label="user.username"/>
                    </datalist>
                    <!--datalist id="groups">
                        <option v-for="group in userGroups" :key="group.id" :value="group.name" :label="group.name"/>
                    </datalist-->
                </div>

                <div class="form-group">
                    <label for="budget">Budget assigned: </label>
                    <input type="number" name="budget" id="budget" step="0.01" v-model="budgetAssigned"> <p> € </p>
                </div>
                <div v-if="isEditing" class="form-group">
                    <label for="budgetUsed">Budget used: </label>
                    <input type="number" name="budgetUsed" id="budgetUsed" step="0.01" v-model="budgetUsed"> <p> € </p>
                </div>

                <div class="buttons">
                    <button type="button" @click.prevent="exit" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="onSubmit" class="submit">Confirm</button>
                </div>
            </form>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde';

    export default {
        components: {
            markdownEditor
        },
        computed: {
            mission() {
                return store.getters.selectedMission;
            },
            users() {
                return store.getters.users;
            },
            groups() {
                return store.getters.groups;
            },
            userGroups() {
                return store.getters.selectedUser.groups;
            },
            group() {
                return store.getters.selectedGroup;
            }
        },
        data() {
            return {
                id: 0,
                name: '',
                leaderId: 1,
                leaderName: '',
                groupId: 1,
                groupName: 'default',
                markdown: '',
                budgetAssigned: '',
                budgetUsed: '',
                isEditing: false,

                configs: {
                    placeholder: 'Description...',
                    spellChecker: false
                },
            };
        },
        async mounted() {
            await this.refreshAll();
            return this.user;
        },
        methods: {
            async selectUser(name) {
                let leaderId = this.users.find(myUser => myUser.username == name).id;
                await store.dispatch('selectUser', leaderId);
                this.leaderId = leaderId;
            },
            setGroupId(name) {
                let groupId = this.groups.find(myGroup => myGroup.name == name).id;
                this.groupId = groupId;
                console.log('bite', this.groupId);
            },
            async beforeOpen(event) {
                await store.dispatch('retrieveMissions');
                await store.dispatch('retrieveUsers');
                await store.dispatch('retrieveGroups');
                this.setGroupId('default');
                if (event.params.mission_id) {
                    await store.dispatch('retrieveMissions');
                    await store.dispatch('retrieveMission', event.params.mission_id);
                    await store.dispatch('retrieveUsers');
                    await store.dispatch('retrieveGroups');
                    await store.dispatch('retrieveGroup', this.mission.groupId);
                    this.id = this.mission.id;
                    this.name = store.getters.selectedMission.name;
                    this.leaderId = this.mission.leaderId ? this.mission.leaderId.toString() : '';
                    this.leaderName = this.mission.leader.username;
                    this.markdown = this.mission.markdown.replace(/<br>/gi, '');
                    this.budgetUsed = this.mission.budgetUsed ? this.mission.budgetUsed.toString() : 0;
                    this.budgetAssigned = this.mission.budgetAssigned ? this.mission.budgetAssigned.toString() : 0;
                    this.isEditing = true;
                } else {
                    this.id = '';
                    this.name = '';
                    this.leaderId = event.params.loggedUser.id;
                    this.leaderName = event.params.loggedUser.username;
                    this.markdown = '';
                    this.budgetUsed = '';
                    this.budgetAssigned = '';
                    this.isEditing = false;
                }
            },
            exit() {
                this.$modal.hide('missionModal');
            },
            async onSubmit() {
                if(this.name.trim() == '') {
                    this.$notify({
                        type: 'error',
                        title: 'Name must be specified',
                        text: 'Please fill the form',
                        duration: 5000
                    });
                    return false;
                }
                if(!store.getters.users.map(us => us.id).includes(parseInt(this.leaderId, 10))) {
                    console.log(this.leaderId);
                    this.$notify({
                        type: 'error',
                        title: 'Leader doesn\'t exist',
                        text: 'Please select an existing leader',
                        duration: 5000
                    });
                    this.leaderId = 1;
                    this.groupId = 1;
                    return false;
                }
                if(parseFloat(this.budgetAssigned, 10) < 0 || parseFloat(this.budgetUsed, 10) < 0) {
                    this.$notify({
                        type: 'error',
                        title: 'Budgets must be positive',
                        text: 'Please enter a positive or null budget',
                        duration: 5000
                    });
                    this.budgetAssigned = 0.0;
                    this.budgetUsed = 0.0;
                    return false;
                }
                this.setGroupId('default');
                this.loading = true;
                if (this.isEditing) {
                    await store.dispatch('updateMission', {
                        id: this.id,
                        mission: {
                            name: this.name,
                            markdown: this.markdown.replace(/\n/gi, '\n<br>'),
                            leaderId: parseInt(this.leaderId, 10),
                            groupId: parseInt(this.groupId, 10),
                            budgetAssigned: parseFloat(this.budgetAssigned, 10),
                            budgetUsed: parseFloat(this.budgetUsed, 10)
                        }
                    })
                    .then(async () => {
                        await store.dispatch('retrieveMission', this.id);
                    });
                } else {
                    console.log('store', this.leaderId);
                    await store.dispatch('storeMission', {
                        name: this.name,
                        markdown: this.markdown.replace(/\n/gi, '\n<br>'),
                        leaderId: parseInt(this.leaderId, 10),
                        groupId: parseInt(this.groupId, 10),
                        budgetAssigned: parseFloat(this.budgetAssigned, 10)
                    })
                    .then(async (res) => {
                        await store.dispatch('retrieveMission', res.data.id);
                    });
                }
                this.$modal.hide('missionModal');
                this.$notify({
                    type: 'success',
                    title: 'Operation successful',
                    text: 'Mission was successfully added',
                    duration: 5000
                });
                this.loading = false;
            },
            async refreshAll() {
                this.loading = true;
                await store.dispatch('retrieveUsers', true);
                await store.dispatch('retrieveGroups', true);
                this.loading = false;
            }
        }
    };
</script>
