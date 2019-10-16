<template>
    <div id="events">
        <event></event>

        <section class="content">
            <h1 class="section-title color-yellow">Events</h1>

            <section> <!-- DO NOT REMOVE THE SECTION TAG -->
                <template v-if="events.length > 0">
                    <div class="event flex-abstract" v-for="event in events" :key="event.id" @click="showEvent(event)">
                        <p class="registered" v-show="event.maxRegistered">{{ event.registeredCount }}/{{ event.maxRegistered }}</p>
                        <h1><a href="#">{{ event.name }}</a></h1>
                        <p class="date">The {{ event.startDate | moment('DD/MM/YYYY') }}</p>
                        <p v-if="event.maxRegistered > 0 && event.registeredCount < event.maxRegistered">
                            <a href="#" @click.prevent.stop="addUser(event.id)" class="button success" v-if="!isRegistered(event.id)">
                                Join
                            </a>
                            <a href="#" @click.prevent.stop="withdrawUser(event.id)" class="button alert" v-else>
                                Withdraw
                            </a>
                        </p>
                        <p v-else>
                            <a href="#" @click.prevent.stop="withdrawUser(event.id)" class="button alert" v-if="isRegistered(event.id)">
                                Withdraw
                            </a>
                            <a href="#" class="button" disabled v-else>Full</a>
                        </p>
                    </div>
                </template>
                <template v-else>
                    <p class="no-event-message">
                        <b>No event yet, but you are encouraged to share any idea with the Comm team.</b>
                        <br>It will be their pleasure to organize it!
                    </p>
                </template>
            </section>
        </section>
    </div>
</template>

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';
    import EventsApi from '@/modules/events/events_api';

    import Event from './Event';

    export default {
        components: {
            Loader,
            Event
        },
        data() {
            return {
                loading: false
            };
        },
        mounted() {
            store.dispatch('retrieveLoggedUser');
            this.refreshEvents(true, true);
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
                let i;
                for (i = 0; i < store.getters.events.length; i++) {
                    this.isRegistered(store.getters.events[i].id);
                }
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
            showEvent(event) {
                this.$modal.show('event', {'event': event});
            },
            isRegistered(event_id) {
                return store.getters.loggedUserEvents.includes(event_id);
            },
            async addUser(event_id) {
                await EventsApi.register(event_id, store.getters.loggedUserId);
                await store.dispatch('retrieveEvents', true);
                await store.dispatch('retrieveLoggedUser');

                this.$notify({
                    type: 'success',
                    title: 'You joined the event!',
                    duration: 1000
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
