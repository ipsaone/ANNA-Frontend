<template>
    <modal name="editMission" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Edit mission</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">
                <markdown-editor v-model="mission.markdown" :configs="configs"></markdown-editor>

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
                    <button type="button" @click.prevent="$modal.hide('newMission')" class="cancel">Cancel</button>
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
        methods: {
            async beforeOpen(mission) {
                await store.dispatch('retrieveMissions');
                console.log('salut', store.getters.selectedMission);
                await store.dispatch('retrieveUsers');
                await store.dispatch('retrieveGroups');
                await store.dispatch('retrieveMission', store.getters.selectedMission.id);
                //console.log('diantre', mission);
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
                try {
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
                    await store.dispatch('retrieveMissions', true);
                } catch (err) {
                    console.log(err);
                    this.$notify({
                        type: 'error',
                        title: 'Operation failed',
                        text: err,
                        duration: 5000
                    });
                }
                this.loading = false;
            }
        }
    };
</script>
