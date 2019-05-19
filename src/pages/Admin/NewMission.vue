<template>
    <modal name="newMission" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Create a new mission</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">
                <markdown-editor v-model="markdown" :configs="configs"></markdown-editor>

                <div class="inline-form">
                    <label for="chief">Chief: </label>
                    <input list="users" type="text" name="chief" id="chief" v-model="chiefName" autocomplete="off" @change="selectUser(chiefName)"><br/>
                    <label v-if="userGroups && userGroups.length != 0" for="group">Group: </label>
                    <label v-else for="group">User has no group. Leaders need to be in a group.</label>
                    <input v-if="userGroups && userGroups.length != 0" list="groups" type="text" name="groups" id="group" v-model="groupName" autocomplete="off" @change="setGroupId(groupName)">
                    <datalist id="users">
                        <option v-for="user in users" :key="user.id" :value="user.username" :label="user.username"/>
                    </datalist>
                    <datalist id="groups">
                        <option v-for="group in userGroups" :key="group.id" :value="group.name" :label="group.name"/>
                    </datalist>
                </div>

                <div class="inline-form">
                    <label for="budget">Budget assigned: </label>
                    <input type="number" name="budget" id="budget" step="0.01" v-model="budgetAssigned"> €
                </div>

                <div class="buttons">
                    <button type="button" @click.prevent="$modal.hide('newMission')" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="onSubmit" class="submit">Submit</button>
                </div>
            </form>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';

    export default {
        components: {
            markdownEditor
        },
        async mounted() {
            await store.dispatch('retrieveUsers');
            await store.dispatch('retrieveGroups');
        },
        data() {
            return {
                name: '',
                markdown: '',
                chief: 1,
                chiefName: '',
                group: 1,
                groupName: '',
                budgetAssigned: 0.0,

                configs: {
                    placeholder: 'Description...',
                    spellChecker: false
                },
            };
        },
        computed: {
            users() {
                return store.getters.users;
            },
            groups() {
                return store.getters.groups;
            },
            selectedUser() {
                return store.getters.selectedUser;
            },
            userGroups() {
                return store.getters.selectedUser.groups;
            }
        },
        methods: {
            async selectUser(name) {
                let chiefId = this.users.find(myUser => myUser.username == name).id;
                await store.dispatch('selectUser', chiefId);
                this.chief = chiefId;
            },
            setGroupId(name) {
                let groupId = this.userGroups.find(myGroup => myGroup.name == name).id;
                this.group = groupId;
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
                if(!store.getters.users.map(us => us.id).includes(parseInt(this.chief, 10)) || !store.getters.groups.map(gp => gp.id).includes(parseInt(this.group))) {
                    this.$notify({
                        type: 'error',
                        title: 'Leader or group doesn\'t exist',
                        text: 'Please select an existing leader and group',
                        duration: 5000
                    });
                    this.chief = 1;
                    this.group = 1;
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
                this.loading = true;
                await store.dispatch('storeMission', {
                    name: this.name,
                    markdown: this.markdown,
                    leaderId: parseInt(this.chief, 10),
                    groupId: parseInt(this.group, 10),
                    budgetAssigned: parseFloat(this.budgetAssigned, 10)
                });
                this.$modal.hide('newMission');
                this.$notify({
                    type: 'success',
                    title: 'Operation successful',
                    text: 'Mission was successfully added',
                    duration: 5000
                });

                this.name = '';
                this.markdown = '';
                this.chief = 1;
                this.group = 1;
                this.budgetAssigned = 0.0;
                this.loading = false;
            }
        }
    };
</script>
