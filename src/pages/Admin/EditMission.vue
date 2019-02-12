<template>
    <modal name="editMission" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Edit mission</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">
                <markdown-editor v-model="markdown" :configs="configs"></markdown-editor>

                <div class="inline-form">
                    <label for="chief">Chief: </label>
                    <input list="users" type="text" name="chief" id="chief" v-model="chief"><br/>
                    <label for="group">Group: </label>
                    <input list="groups" type="text" name="groups" id="group" v-model="group">

                    <datalist id="users">
                        <option v-for="user in users" :key="user.id" :value="user.id" :label="user.username"/>
                    </datalist>
                    <datalist id="groups">
                        <option v-for="group in groups" :key="group.id" :value="group.id" :label="group.name"/>
                    </datalist>
                </div>

                <div class="inline-form">
                    <label for="budget">Budget assigned: </label>
                    <input type="number" name="budget" id="budget" step="0.01" v-model="budgetAssigned"> €
                    </br>
                    <label for="budgetUsed">Budget used: </label>
                    <input type="number" name="budgetUsed" id="budgetUsed" step="0.01" v-model="budgetUsed"> €
                </div>

                <div class="buttons">
                    <button type="button" @click.prevent="$modal.hide('editMission')" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="onSubmit" class="submit">Confirm</button>
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
        computed: {
            mission() {
                return store.getters.selectedMission;
            },
            users(){
                return store.getters.users;
            },
            groups(){
                return store.getters.groups;
            }
        },
        data() {
            return {
                id: 0,
                name: '',
                chief: '',
                group: '',
                markdown: '',
                budgetAssigned: '',
                budgetUsed: '',

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
            async beforeOpen(event) {
                await store.dispatch('retrieveMissions');
                await store.dispatch('retrieveMission', event.params.mission_id);
                await store.dispatch('retrieveUsers');
                await store.dispatch('retrieveGroups');
                this.id = this.mission.id;
                this.name = store.getters.selectedMission.name;
                this.chief = this.mission.leaderId ? this.mission.leaderId.toString() : '';
                this.group = this.mission.groupId ? this.mission.groupId.toString() : '';
                this.markdown = this.mission.markdown;
                this.budgetUsed = this.mission.budgetUsed ? this.mission.budgetUsed.toString() : 0;
                this.budgetAssigned = this.mission.budgetAssigned ? this.mission.budgetAssigned.toString() : 0;

            },
            exit() {
                this.$modal.hide('editMission');
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
                    console.log('in');
                    console.log('ma bite', typeof this.chief);
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
                await store.dispatch('updateMission', {
                    id: this.id,
                    mission: {
                        name: this.name,
                        markdown: this.markdown,
                        leaderId: parseInt(this.chief, 10),
                        groupId: parseInt(this.group, 10),
                        budgetAssigned: parseFloat(this.budgetAssigned, 10),
                        budgetUsed: parseFloat(this.budgetUsed, 10)
                    }
                });
                this.$modal.hide('editMission');
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
                await store.dispatch('retrieveMissions', true);
                await store.dispatch('retrieveUsers', true);
                await store.dispatch('retrievePosts', true);
                await store.dispatch('retrieveLogs', true);
                await store.dispatch('retrieveGroups', true);
                await store.dispatch('retrieveEvents', true);
                this.loading = false;
            }
        }
    };
</script>
