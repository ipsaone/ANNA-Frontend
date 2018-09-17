<template>
    <modal name="membersManagement" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Members Management</h1>
            <h2>Mission name</h2>
            
            
            

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
                users = []
            };
        },
        methods: {
            onSubmit() {
                console.log('Hello world!');
            }
        }
    };
</script>