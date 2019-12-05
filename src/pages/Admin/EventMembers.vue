<template>
    <modal
        name="eventMembers"
        height="auto"
        :scrollable="true"
        @before-open="beforeOpen"
    >
        <div class="content anna-modal event-members manage-members">
            <h1 v-if="event.name">
                Event: {{ event.name }}
            </h1>
            <i
                class="fa fa-times"
                @click="$modal.hide('eventMembers')"
            />

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
                            v-for="member in event.registered"
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
        event() {
            return store.getters.selectedEvent;
        }
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
            await store.dispatch('remEventMember', id);
            await this.refreshUsers();
        },
        async refreshUsers() {
            await store.dispatch('retrieveUsers');
            await store.dispatch('retrieveEvents', true);
            this.shownUsers = store.getters.users.filter(user => !this.event.registered.map(reg => reg.id).includes(user.id));
        }
    }
};
</script>
