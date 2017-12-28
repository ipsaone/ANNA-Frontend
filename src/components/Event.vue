<template>
    <modal class="event-modal" name="event" @before-open="beforeOpen" @before-close="beforeClose" height="auto">
        <div class="content anna-modal">
            <h1>{{ event.name }}</h1>

            <p class="info">The {{ event.createdAt | moment('DD/MM/YYYY [at] HH:mm') }}</p>

            <p class="description">{{ event.content }}</p>

            <button @click="deleteEvent" class="button alert">Delete</button>
        </div>
    </modal>
</template>

<script>
    import store from '@/store';

    export default {
        data() {
            return {
                event: {}
            };
        },
        methods: {
            beforeOpen(event) {
                store.dispatch('selectEvent', event.params.event.id)
                    .then(_ => {
                        this.event = store.getters.selectedEvent;
                    });
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