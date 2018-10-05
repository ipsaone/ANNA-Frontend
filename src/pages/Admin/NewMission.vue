<template>
    <modal name="newMission" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Create a new mission</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">
                <p>Description:</p>
                <markdown-editor v-model="description" placeholder="Description..."></markdown-editor>

                <div class="inline-form">
                    <label for="chief">Chief: </label>
                    <input list="users" name="chief" id="chief" v-model="chief">
                    Group:
                    <input list="groups" name="groups" id="group" v-model="group">

                    <datalist id="users">
                        <option v-for="user in users" :key="user.id" :value="user"/>
                    </datalist>
                    <datalist id="groups">
                        <option v-for="group in groups" :key="group.id" :value="groups"/>
                    </datalist>
                </div>

                <div class="inline-form">
                    <label for="budget">Budget assigned: </label>
                    <input type="number" name="budget" id="budget" step="0.01" v-model="budgetAssigned"> €
                </div>

                <button type="submit" class="button success" @click.prevent="onSubmit">Submit</button>
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
        data() {
            return {
                name: '',
                description: '',
                chief: '',
                group:'',
                budgetAssigned: 0.0,
                users: []
            };
        },
        methods: {
            onSubmit() {
                console.log('Hello world!');
                store.dispatch('storeMission', {name: this.name, description: this.description, leaderId: parseInt(this.chief, 10), groupId: parseInt(this.group, 10), budgetAssigned: parseFloat(this.budgetAssigned, 10)});
            }
        }
    };
</script>