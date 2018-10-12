<template>
    <modal name="newMission" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Create a new mission</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">
                <markdown-editor v-model="description" :configs="configs"></markdown-editor>

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
                description: '',
                chief: 1,
                group: 1,
                budgetAssigned: 0.0,

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
            }
        },
        methods: {
            async onSubmit() {
                this.loading = true;
                try {
                    await store.dispatch('storeMission', {
                        name: this.name, 
                        description: this.description, 
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
                    this.description = '';
                    this.chief = 1;
                    this.group = 1;
                    this.budgetAssigned = 0.0;
                } catch (err) {
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