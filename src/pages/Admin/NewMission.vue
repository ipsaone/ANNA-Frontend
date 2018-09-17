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
                    <input list="users" name="chief" id="chief" v-model="chidef">

                    <datalist id="users">
                        <option v-for="user in users" :key="user.id" :value="user"/>
                    </datalist>
                </div>

                <div class="inline-form">
                    <label for="budget">Budget: </label>
                    <input type="number" name="budget" id="budget" step="0.01" v-model="budget"> €
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
                descruption: '',
                chief: '',
                budget: 0.0,
                users: []
            };
        },
        methods: {
            onSubmit() {
                console.log('Hello world!');
            }
        }
    };
</script>