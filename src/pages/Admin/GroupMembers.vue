<template>
    <modal
        name="groupMembers"
        height="auto"
        :scrollable="true"
        @before-open="beforeOpen"
    >
        <div class="content anna-modal group-members manage-members">
            <h1 v-if="group.name">Group: {{ group.name }}</h1>
            <i class="fa fa-times" @click="$modal.hide('groupMembers')" />

            <div class="lists-wrapper">
                <div class="left-col">
                    <h2>Users</h2>
                    <ul class="users-list">
                        <a
                            v-for="user in shownUsers"
                            :key="user.id"
                            @click="addUser(user.id)"
                        >
                            {{ user.username }}
                        </a>
                    </ul>
                </div>
                <div class="right-col">
                    <h2>Members</h2>
                    <ul class="members-list">
                        <a
                            v-for="member in group.users"
                            :key="member.id"
                            @click="remUser(member.id)"
                        >
                            {{ member.username }}
                        </a>
                    </ul>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import store from '@/modules/store';
import swal from 'sweetalert2';

export default {
    data() {
        return {
            shownUsers: []
        };
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
    methods: {
        async beforeOpen(event) {
            await store.dispatch('retrieveGroups');
            await store.dispatch('retrieveGroup', event.params.group_id);
            this.refreshUsers();
        },
        async addUser(id) {
            await store.dispatch('addGroupMember', id);
            this.refreshUsers();
            store.dispatch('retrieveGroups', true);
        },
        async remUser(id) {
            if (this.group.name === 'root' && this.group.users.length == 1) {
                this.$notify({
                    type: 'error',
                    title: 'Empty group',
                    text: 'Group root must not be empty',
                    duration: 5000
                });
                return false;
            } else if (id == store.getters.loggedUserId) {
                swal({
                    title: 'Leave group?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#E74D3C',
                    cancelButtonColor: '#7A7A7A',
                    confirmButtonText: 'Delete'
                }).then(() => {
                    store
                        .dispatch('remGroupMember', id)
                        .then(() => {
                            this.refreshUsers();
                            this.$modal.hide('groupMembers');
                            store.dispatch('retrieveGroups', true);
                            store.dispatch('retrieveLoggedUser', true).then(() => {
                                this.showAdmin();
                                if (!this.showAdmin()) {
                                    window.location.replace('/dashboard');
                                }
                            });
                        })
                        .catch(err => {
                            this.$notify({
                                type: 'error',
                                title: 'fens',
                                text: err.message,
                                duration: -1
                            });
                        });
                });
            } else {
                await store.dispatch('remGroupMember', id);
                this.refreshUsers();
                await store.dispatch('retrieveGroups', true);
                await store.dispatch('retrieveLoggedUser').then(() => {
                    this.showAdmin();
                    if (!this.showAdmin()) {
                        window.location.replace('/dashboard');
                    }
                });
            }
        },
        refreshUsers() {
            if (!this.group.users) {
                this.shownUsers = store.getters.users;
            }
            this.shownUsers = store.getters.users.filter(el1 => {
                let found = false;
                this.group.users.forEach(el2 => {
                    if (el1.id == el2.id) {
                        found = true;
                    }
                });

                return !found;
            });
        },
        showAdmin() {
            return store.getters.loggedUserIsRoot;
        }
    }
};
</script>
