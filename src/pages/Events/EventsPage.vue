<template>
    <div id="events">
        <event />
        <event-modal class="admin" />

        <section class="content">
            <h1 class="section-title color-yellow">
                Events
            </h1>

            <section>
                <!-- DO NOT REMOVE THE SECTION TAG -->
                <template v-if="events.length > 0">
                    <div
                        v-for="event in events"
                        :key="event.id"
                        class="event flex-abstract"
                    >
                        <p v-if="event.maxRegistered != null" class="registered">
                            {{ event.registeredCount }}/{{ event.maxRegistered }}
                        </p>
                        <p v-else class="registered">{{ event.registeredCount }}/∞</p>
                        <h1 style="text-shadow: 0 0 1px #000000">
                            <a href="#" @click.prevent="showEvent(event)">{{ event.name }}</a>
                        </h1>
                        <p>
                            <a
                                v-if="groupOrganizer"
                                @click.prevent="
                                    $modal.show('eventModal', {
                                        event_id: event.id,
                                        isEditing: true
                                    })
                                "
                            >Edit</a>
                        </p>
                        <p class="date">
                            {{ event.startDate | moment("DD/MM/YYYY") }}
                        </p>
                        <p
                            v-if="
                                (event.maxRegistered > 0 &&
                                    event.registeredCount < event.maxRegistered) ||
                                    event.maxRegistered == null
                            "
                        >
                            <a
                                v-if="!isRegistered(event.id)"
                                href="#"
                                class="button success"
                                @click.prevent.stop="addUser(event.id)"
                            >
                                Join
                            </a>
                            <a
                                v-else
                                href="#"
                                class="button alert"
                                @click.prevent.stop="withdrawUser(event.id)"
                            >
                                Withdraw
                            </a>
                        </p>
                        <p v-else>
                            <a
                                v-if="isRegistered(event.id)"
                                href="#"
                                class="button alert"
                                @click.prevent.stop="withdrawUser(event.id)"
                            >
                                Withdraw
                            </a>
                            <a
                                v-if="
                                    event.registeredCount === event.maxRegistered &&
                                        event.maxRegistered != null &&
                                        !isRegistered(event.id)
                                "
                                href="#"
                                class="button"
                                disabled
                            >Full</a>
                        </p>
                    </div>
                </template>
                <template v-else>
                    <p class="no-event-message">
                        <b>No event yet, but you are encouraged to share any idea with the
                            Comm team.</b>
                        <br />It will be their pleasure to organize it!
                    </p>
                </template>
            </section>
        </section>
        <div
            v-if="groupOrganizer"
            style="display: grid;grid-template-columns: 3em auto 12em 8em;grid-column-gap: 10px;padding: 0.4em;"
        >
            <h4 style="grid-column: 4;text-align: center;">
                <a @click.prevent="$modal.show('eventModal', { isEditing: false })">Add Event</a>
            </h4>
        </div>
    </div>
</template>

<script>
import store from '@/modules/store';
import EventsApi from '@/modules/events/events_api';
import EventModal from '@/pages/Admin/EventModal';
import Event from './Event';

export default {
    components: {
        Event,
        EventModal
    },
    data() {
        return {
            loading: false
        };
    },
    computed: {
        events() {
            return store.getters.events;
        },
        canAdd() {
            return store.getters.loggedUserIsRoot;
        },
        groupOrganizer() {
            return store.getters.loggedUserGroups.includes('organizers');
        }
    },
    mounted() {
        console.log(this);
        store.dispatch('retrieveLoggedUser');
        this.refreshEvents(true, true);
    },
    methods: {
        refreshEvents(force = false, mounted = false) {
            this.loading = true;
            let i;
            for (i = 0; i < store.getters.events.length; i++) {
                this.isRegistered(store.getters.events[i].id);
            }
            store
                .dispatch('retrieveEvents', force)
                .then((this.loading = false))
                .then(() => {
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
            this.$modal.show('event', { event: event });
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
            return EventsApi.withdraw(event_id, store.getters.loggedUserId)
                .then(() => store.dispatch('retrieveEvents', true))
                .then(() => store.dispatch('retrieveLoggedUser'))
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
