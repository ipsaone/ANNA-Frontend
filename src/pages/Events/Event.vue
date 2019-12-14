<template>
    <modal
        name="event"
        height="auto"
        :scrollable="true"
        @before-open="beforeOpen"
        @before-close="beforeClose"
    >
        <div class="content anna-modal">
            <h1>{{ event.name }}</h1>

            <p class="info">
                Start the {{ event.startDate | moment("DD/MM/YYYY") }}<br />
                <span v-show="event.endDate">Finish the {{ event.endDate | moment("DD/MM/YYYY") }}</span>
            </p>

            <div class="description" v-html="event.content" />

            <button v-if="showAdmin()" class="button alert" @click="deleteEvent">
                Delete
            </button>
        </div>
    </modal>
</template>

<script>
import store from '@/modules/store';

export default {
    data() {
        return {
            event: {}
        };
    },
    methods: {
        beforeOpen(data) {
            store.commit('SELECT_EVENT', data.params.event);
            this.event = store.getters.selectedEvent;
        },
        beforeClose() {
            store.dispatch('unselectEvent');
        },
        deleteEvent() {
            store
                .dispatch('deleteEvent', this.event.id)
                .then(this.$modal.hide('event'));
        },
        showAdmin() {
            return store.getters.loggedUserIsRoot;
        }
    }
};
</script>
