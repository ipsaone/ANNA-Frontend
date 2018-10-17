<template>
    <modal name="groupMembers" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal group-members">
            <h1 v-if="group.name"> Group: {{ group.name }}</h1>

            <div class="lists-wrapper">
                <h2>Users</h2>
                <h2>Members</h2>
                    <ul class="users-list">
                      <a v-for="user in shownUsers" :key="user.id" v-on:click="addUser(user.id)">
                          {{user.username}}
                      </a>
                    </ul>
                  <ul class="members-list">
                      <a v-for="member in group.users" :key="member.id" v-on:click="remUser(member.id)">
                          {{member.username}}
                      </a>
                  </ul>

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
            group() {
                return store.getters.selectedGroup;
            }
        },
        data() {
            return {
                shownUsers: []
            };
        },
        methods: {
            async beforeOpen(event) {
                await store.dispatch('retrieveGroup', event.params.group_id);
                this.refreshUsers();
                console.log(this.group);
            },
            async addUser(id) {
                console.log('adding', id);
                await store.dispatch('addGroupMember', id);
                this.refreshUsers();
            },
            async remUser(id) {
                console.log('removing', id);
                await store.dispatch('remGroupMember', id);
                this.refreshUsers();
            },
            refreshUsers() {
                if (!this.group.users) {
                    this.shownUsers = store.getters.users;
                }
                this.shownUsers =  store.getters.users.filter(el1 => {
                    let found = false;
                    this.group.users.forEach(el2 => {
                        if (el1.id == el2.id) {
                            found = true;
                        }
                    });

                    return !found;
                });
            }
        }
    };
</script>
