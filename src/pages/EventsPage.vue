<template>
    <div class="events basic-layout">
        <loader v-if="loading"></loader>
        <new-event></new-event>
        <event></event>

        <section class="content">
            <h1 class="section-title">Events</h1>

            <section> <!-- DO NOT REMOVE THE SECTION TAG -->
                <div class="event flex-abstract" v-for="event in events" :key="event.id" @click="showEvent(event)">
                    <p class="id">#{{ event.id }}</p>
                    <h1><a href="#">{{ event.name }}</a></h1>
                    <p class="date">The {{ event.publishedAt | moment('DD/MM/YYYY [at] HH:mm') }}</p>
                    <p><a href="#" @click.prevent.stop="addUser" class="button success">Join</a></p>
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
            this.refreshEvents();
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
            refreshEvents(force = false) {
                this.loading = true;
                store.dispatch('retrieveEvents', force)
                    .then(this.loading = false)
                    .then(_ => {
                        this.$notify({
                            type: 'success',
                            title: 'Events updated!',
                            duration: 1000
                        });
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
            addUser() {
                console.log('adding user');
            }
        }
    };
</script>