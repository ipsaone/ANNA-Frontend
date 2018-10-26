<template>
    <modal name="editEvent" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Edit event</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">

                <markdown-editor v-model="description" :configs="configs"></markdown-editor>

                <div class="form-group">
                    <label for="evt_start">Start date :</label>
                    <input type="date" name="evt_start" v-model="start">
                </div>

                <div class="form-group">
                    <label for="evt_end">End date :</label>
                    <input type="date" name="evt_end" v-model="end">
                </div>

                <div class="form-group">
                    <label for="evt_max">Open slots :</label>
                    <input type="number" name="evt_max" v-model="max">
                </div>



                <div class="buttons">
                    <button type="button" @click.prevent="exit" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="onSubmit" class="submit">Confirm</button>
                </div>
            </form>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';
    import moment from 'moment';

    export default {
        components: {
            markdownEditor
        },
        computed: {
            event() {
                return store.getters.selectedEvent;
            }
        },
        data() {
            return {
                id: 0,
                name: '',
                description: '',
                max: 0,
                start: '',
                end: '',
                configs: {
                    placeholder: 'Description...',
                    spellChecker: false
                },
            };
        },
        methods: {
            async beforeOpen(event) {
                console.log('LOADING EVENT');
                console.log(event);
                await store.dispatch('retrieveEvent', event.params.event_id);
                console.log('IDENTIFICATION', this.event.startDate);
                this.id = this.event.id;
                this.name = this.event.name;
                this.description = this.event.markdown;
                this.max = this.event.maxRegistered;
                this.start = moment(this.event.startDate).format('YYYY-MM-DD');
                this.end = moment(this.event.endDate).format('YYYY-MM-DD');
            },
            exit() {
                this.$modal.hide('editEvent');
            },
            async onSubmit() {
                try {
                    this.loading = true;
                    console.log('new Event',{
                        name: this.name,
                        markdown: this.description,
                        maxRegistered: this.max,
                        startDate: this.start,
                        endDate: this.end
                    }
                    );
                    await store.dispatch('updateEvent', {
                        id: this.id,
                        event: {
                            name: this.name,
                            markdown: this.description,
                            maxRegistered: this.max,
                            startDate: this.start,
                            endDate: this.end
                        }
                    });
                    this.$modal.hide('editEvent');
                    this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'Mission was successfully added',
                        duration: 5000
                    });

                    await store.dispatch('retrieveEvents', true);
                } catch (err) {
                    console.log(err);
                    this.$notify({
                        type: 'error',
                        title: 'Operation failed',
                        text: err,
                        duration: 5000
                    });
                }
                this.loading = false;
            }
        }
    };
</script>
