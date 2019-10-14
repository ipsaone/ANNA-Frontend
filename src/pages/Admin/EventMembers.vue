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
                await store.dispatch('retrieveEvents', true);
                await store.dispatch('retrieveEvent', event.params.event_id);
                console.log(this.event);
                this.refreshUsers();
            },
            async addUser(id) {
                await store.dispatch('addEventMember', id);
                await this.refreshUsers();
            },
            async remUser(id) {
                await store.dispatch('remMissionMember', id);
                await this.refreshUsers();
            },
            async refreshUsers() {
                await store.dispatch('retrieveUsers');
                await store.dispatch('retrieveEvents', true);
                if (!this.event.users) {
                    this.shownUsers = store.getters.users;
                }
                this.shownUsers =  store.getters.users.filter(el1 => {
                    let found = false;
                    console.log('el1', el1);
                    console.log('event: ', this.event);
                    this.event.registered.forEach(el2 => {
                        console.log('el2', el2);
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
