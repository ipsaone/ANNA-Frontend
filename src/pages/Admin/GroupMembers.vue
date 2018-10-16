<template>
    <modal name="groupMembers" height="auto" :scrollable="true">
        <div class="content anna-modal group-members">
            <h1>Members Management</h1>
            <h2>Group: {{ group.name }}</h2>


            <form class="" action="" method="post">
                <ul>
                  <li v-for="user in users">{{user.username}}<input type="checkbox" name=user.username></li>
                </ul>

            </form>


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
        computed: {
            users() {
                return store.getters.users;
            },
            groups() {
                return store.getters.groups;
            }
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
                this.loading = true;
            }
        }
    };
</script>
