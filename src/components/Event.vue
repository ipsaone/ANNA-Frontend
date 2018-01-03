<template>
    <modal name="event" @before-open="beforeOpen" @before-close="beforeClose" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>{{ event.name }}</h1>

            <p class="info">
                Start the {{ event.startDate | moment('DD/MM/YYYY [at] HH:mm') }}<br>
                <span v-show="event.endDate">Finish the {{ event.endDate | moment('DD/MM/YYYY [at] HH:mm') }}</span>
            </p>

            <div class="description" v-html="event.content"></div>

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