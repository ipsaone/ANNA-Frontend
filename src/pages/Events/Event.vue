<template>
    <modal name="event" @before-open="beforeOpen" @before-close="beforeClose" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>{{ event.name }}</h1>

            <p class="info">
                Start the {{ event.startDate | moment('DD/MM/YYYY') }}<br>
                <span v-show="event.endDate">Finish the {{ event.endDate | moment('DD/MM/YYYY') }}</span>
            </p>

            <div class="description" v-html="event.content"></div>

            <button @click="deleteEvent" class="button alert">Delete</button>
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
            beforeOpen(event) {
                store.commit('SELECT_EVENT', event.params.event.id);
                this.event = store.getters.selectedEvent;
            },
            beforeClose(event) {
                store.dispatch('unselectEvent');
            },
            deleteEvent() {
                store.dispatch('deleteEvent', this.event.id)
                    .then(this.$modal.hide('event'));
            }
        }
    };
</script>