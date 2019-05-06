<template>
    <modal name="eventMembers" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal event-members manage-members">

            <h1 v-if="event.name"> Event: {{ event.name }}</h1>
            <i class="fa fa-times" v-on:click="$modal.hide('eventMembers')"></i>

            <div class="lists-wrapper">
                <div class="left-col">
                    <h2>Users</h2>
                    <ul class="users-list">
                        <a v-for="user in shownUsers" :key="user.id" v-on:click="addUser(user.id)">
                            {{user.username}}
                        </a>
                    </ul>
                </div>
                <div class="right-col">
                    <h2>Members</h2>
                    <ul class="members-list">
                        <a v-for="member in event.registered" :key="member.id" v-on:click="remUser(member.id)">
                            {{member.username}}
                        </a>
                    </ul>
                </div>
            </div>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';
    import EventsApi from '@/modules/events/events_api';

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
            event() {
                return store.getters.selectedEvent;
            }
        },
        data() {
            return {
                shownUsers: []
            };
        },
        methods: {
            async beforeOpen(event) {
                await store.dispatch('retrieveEvent', event.params.event_id);
                this.refreshUsers();
            },
            async addUser(id) {
                await EventsApi.register(store.getters.selectedEvent.id, id);
                await this.refreshUsers();
                await store.dispatch('retrieveEvents', true);
                await store.dispatch('retrieveEvents', false);
                this.loading = false;
                this.$notify({
                    type: 'success',
                    title: 'Events updated!',
                    duration: 1000
                });
            },
            async remUser(id) {
                await EventsApi.withdraw(store.getters.selectedEvent.id, id);
                await this.refreshUsers();
                await store.dispatch('retrieveEvents', true);
                await store.dispatch('retrieveEvents', false);
                this.loading = false;
                this.$notify({
                    type: 'success',
                    title: 'Events updated!',
                    duration: 1000
                });
            },
            async refreshUsers() {
                await store.dispatch('retrieveEvent', store.getters.selectedEvent.id);
                if (!this.event.users) {
                    this.shownUsers = store.getters.users;
                }
                this.shownUsers =  store.getters.users.filter(el1 => {
                    let found = false;
                    this.event.registered.forEach(el2 => {
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
