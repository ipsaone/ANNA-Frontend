<template>
    <div class="events basic-layout">
        <loader v-if="loading"></loader>
        <new-event></new-event>
        <event></event>

        <section class="content">
            <h1 class="section-title">Events</h1>

            <section> <!-- DO NOT REMOVE THE SECTION TAG -->
                <template v-if="events.length > 0">
                    <div class="event flex-abstract" v-for="(event, index) in events" :key="event.id" @click="showEvent(event)">
                        <p class="registered" v-show="event.maxRegistered">0/{{ event.maxRegistered }}</p>
                        <h1><a href="#">{{ event.name }}</a></h1>
                        <p class="date">The {{ event.startDate | moment('DD/MM/YYYY [at] HH:mm') }}</p>
                        <p>
                            <a href="#" @click.prevent.stop="addUser(event.id)" class="button success" v-if="!isRegistered(event.id)">Join</a>
                            <a href="#" @click.prevent.stop="withdrawUser(event.id)" class="button alert" v-else="isRegistered(event.id)">Withdraw</a>
                        </p>
                    </div>
                </template>
                <template v-else>
                    <p class="no-event-message">
                        <b>No event yet, but you are encouraged to share any idea with the Comm team.</b>
                        <br>It will be their pleasure to organize it !
                    </p>
                </template>
            </section>
        </section>

        <section class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li>
                    <a href="#" @click.prevent="refreshEvents(true)"><i class="fa fa-refresh" aria-hidden="true"></i> Refresh</a>
                </li>
                <li v-show="canAdd">
                    <a href="#" @click.prevent="newEvent"><i class="fa fa-plus"></i> New event</a>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';
    import NewEvent from '@/components/NewEvent';
    import Event from '@/components/Event';
    import EventsApi from '@/modules/events/events_api';

    export default {
        components: {
            Loader,
            Event,
            NewEvent,
        },
        data() {
            return {
                loading: false
            };
        },
        mounted() {
            this.refreshEvents(false, true);
        },
        computed: {
            events() {
                return store.getters.events;
            },
            canAdd() {
                return store.getters.loggedUserIsRoot;
            }
        },
        methods: {
            refreshEvents(force = false, mounted = false) {
                this.loading = true;
                store.dispatch('retrieveEvents', force)
                    .then(this.loading = false)
                    .then(_ => {
                        if (!mounted) {
                            this.$notify({
                                type: 'success',
                                title: 'Events updated!',
                                duration: 1000
                            });
                        }
                    })
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'Can not retrieve events from server',
                            text: err.message,
                            duration: -1
                        });
                    });
            },
            newEvent() {
                this.$modal.show('newEvent');
            },
            showEvent(event) {
                this.$modal.show('event', {'event': event});
            },
            isRegistered(event_id) {
                return store.getters.loggedUserEvents.includes(event_id);
            },
            addUser(event_id) {
                EventsApi.register(event_id, store.getters.loggedUserId)
                    .then(_ => store.dispatch('retrieveEvents', true))
                    .then(_ => store.dispatch('retrieveLoggedUser'))
                    .then(_ => {
                        this.$notify({
                            type: 'success',
                            title: 'You joined the event!',
                            duration: 1000
                        });
                    })
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'An error occurred.',
                            text: err.message,
                            duration: -1
                        });
                    });
            },
            withdrawUser(event_id) {
                EventsApi.withdraw(event_id, store.getters.loggedUserId)
                    .then(_ => store.dispatch('retrieveEvents', true))
                    .then(_ => store.dispatch('retrieveLoggedUser'))
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'An error occurred.',
                            text: err.message,
                            duration: -1
                        });
                    });
            }
        }
    };
</script>
