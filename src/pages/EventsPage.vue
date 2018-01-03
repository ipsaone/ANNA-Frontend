<template>
    <div class="events basic-layout">
        <loader v-if="loading"></loader>
        <new-event></new-event>
        <event></event>

        <section class="content">
            <h1 class="section-title">Events</h1>

            <section> <!-- DO NOT REMOVE THE SECTION TAG -->
                <div class="event flex-abstract" v-for="(event, index) in events" :key="event.id" @click="showEvent(event)">
                    <p class="registered">0/{{ event.maxRegistered }}</p>
                    <h1><a href="#">{{ event.name }}</a></h1>
                    <p class="date">The {{ event.startDate | moment('DD/MM/YYYY [at] HH:mm') }}</p>
                    <p><a href="#" @click.prevent.stop="addUser(event.id)" class="button success">Join</a></p>
                </div>
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
    import store from '@/store';
    import Loader from '@/components/Loader';
    import NewEvent from '@/components/NewEvent';
    import Event from '@/components/Event';
    import EventsApi from '@/api/events';

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
                            title: 'Can not retrieve data from server',
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
            addUser(event_id) {
                store.dispatch('registerEvent', event_id)
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
            }
        }
    };
</script>