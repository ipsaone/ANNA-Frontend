<template>
    <modal name="editMission" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Edit mission</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="mission.name">
                <markdown-editor v-model="mission.description" :configs="configs"></markdown-editor>

                <div class="inline-form">
                    <label for="chief">Chief: </label>
                    <input list="users" type="text" name="chief" id="chief" v-model="mission.leaderId"><br/>
                    <label for="group">Group: </label>
                    <input list="groups" type="text" name="groups" id="group" v-model="mission.groupId">

                    <datalist id="users">
                        <option v-for="user in users" :key="user.id" :value="user.id" :label="user.username"/>
                    </datalist>
                    <datalist id="groups">
                        <option v-for="group in groups" :key="group.id" :value="group.id" :label="group.name"/>
                    </datalist>
                </div>

                <div class="inline-form">
                    <label for="budget">Budget assigned: </label>
                    <input type="number" name="budget" id="budget" step="0.01" v-model="mission.budgetAssigned"> €
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
        async mounted() {
            await store.dispatch('retrieveUsers');
            await store.dispatch('retrieveGroups');
        },
        data() {
            return {
                configs: {
                    placeholder: 'Description...'
                }
            };
        },
        computed: {
            users(){
                return store.getters.users;
            },
            groups(){
                return store.getters.groups;
            },
            mission() {
                return store.getters.selectedMission;
            }
        },
        methods: {
            async onSubmit() {
                this.loading = true;
                try {
                    await store.dispatch('updateMission', {
                        id: this.mission.id,
                        name: this.mission.name, 
                        description: this.mission.description, 
                        leaderId: parseInt(this.mission.leaderId, 10), 
                        groupId: parseInt(this.mission.groupId, 10), 
                        budgetAssigned: parseFloat(this.mission.budgetAssigned, 10)
                    });
                    this.$modal.hide('editMission');
                    this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'Mission was successfully added',
                        duration: 5000
                    });

                    // TODO: unselect mission from getters.

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