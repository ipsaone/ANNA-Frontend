<template>
    <modal name="groupMembers" height="auto" :scrollable="true">
        <div class="content anna-modal group-members">
            <h1>Members Management</h1>
            <h2>Group: {{ group.name }}</h2>

            <div class="lists-wrapper">
                <h2>Users</h2>
                <h2>Members</h2>
                <form class="" action="" method="post">
                    <ul class="users-list">
                      <a v-for="user in users" v-on:click="addUser(user.id)">
                          {{user.username}}
                      </a>
                    </ul>
                </form>
                <form class="" action="" method="post">
                  <ul class="members-list">
                      <a v-for="member in members" v-on:click="rmUser(user.id)">
                          {{member.username}}
                      </a>
                  </ul>
                </form>

            </div>

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
            },
            members() {
                [{username: 'moi'}, {username: 'toi'}];
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
