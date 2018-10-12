<template>
    <modal name="membersManagement" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Members Management</h1>
            <h2>Group: {{ group.name }}</h2>
            
            <p>TODO</p>
            

            <button type="submit" class="button success" @click.prevent="onSubmit">Submit</button>
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
                group: {}
            };
        },
        methods: {
            beforeOpen(event) {
                this.group =  store.getters.groups.filter(el => el.id == event.params.group_id)[0];

            },
            onSubmit() {
                console.log('Hello world!');
            }
        }
    };
</script>