<template>
    <modal name="eventModal" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal eventModal">
            <h1 v-if="isEditing"> Edit event</h1>
            <h1 v-else> Create a new event </h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">

                <markdown-editor v-model="description" :configs="configs" class="md-editor"></markdown-editor>

                <div class="form-group">
                    <label for="evt_start">Start date :</label>
                    <datepicker class="datepicker" placeholder="Select Date" v-model="start"></datepicker>
                </div>

                <div class="form-group">
                    <label for="evt_end">End date :</label>
                    <datepicker class="datepicker" placeholder="Select Date" v-model="end"></datepicker>
                </div>

                <div class="form-group">
                    <label for="evt_max">Open slots :</label>
                    <input id="openslots-input" type="number" name="evt_max" v-model="max">
                </div>

                <div class="buttons">
                    <button type="button" @click.prevent="exit" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="onSubmit" class="submit">Submit</button>
                </div>
            </form>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';
    import Datepicker from 'vuejs-datepicker';
    import * as moment from 'moment';

    export default {
        components: {
            markdownEditor,
            Datepicker
        },
        data() {
            return {
                isEditing: false,
                name: '',
                description: '',
                max: 0,
                start: new Date(),
                end:  new Date(),

                configs: {
                    placeholder: 'Description...',
                    spellChecker: false
                },
            };
        },
        computed: {
            event() {
                return store.getters.selectedEvent;
            },
            canSubmit() {
                return this.name.trim() !== '' && this.description.trim() !== '' && this.max >= 0;
            }
        },
        methods: {
            exit() {
                this.$modal.hide('eventModal');
            },
            async beforeOpen(event) {
                this.isEditing = event.params.isEditing;
                if(!this.isEditing) {
                    this.name = '';
                    this.description = '';
                    this.max = 0;
                    this.start = new Date();
                    this.end = new Date();
                } else {
                    await store.dispatch('retrieveEvent', event.params.event_id);
                    console.log(this.event);
                    this.id = this.event.id;
                    this.name = this.event.name;
                    this.description = this.event.markdown.replace(/<br>/gi, '');
                    this.max = this.event.maxRegistered;
                    this.start = moment(this.event.startDate).format('YYYY-MM-DD');
                    this.end = moment(this.event.endDate).format('YYYY-MM-DD');
                }
            },
            async onSubmit() {
                if (this.isEditing) {
                    this.loading = true;
                    await store.dispatch('updateEvent', {
                        id: this.event.id,
                        event: {
                            name: this.name,
                            markdown: this.description.replace(/\n/gi, '\n<br>'),
                            maxRegistered: this.max,
                            startDate: this.start,
                            endDate: this.end
                        }
                    });
                    this.$modal.hide('eventModal');
                    // this.$notify({
                    //     type: 'succes',
                    //     title: 'Operation successful',
                    //     text: 'Event was successfully updated',
                    //     duration: 5000
                    // });
                    await store.dispatch('retrieveEvents');
                    this.loading= false;
                } else {
                    let evt =  {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        maxRegistered: this.max,
                        startDate: this.start,
                        endDate: this.end
                    };
                    store.dispatch('storeEvent', evt);
                    this.loading = false;
                    this.$modal.hide('eventModal');
                    // this.$notify({
                    //     type: 'success',
                    //     title: 'Operation successful',
                    //     text: 'Mission was successfully added',
                    //     duration: 5000
                    // });
                    await store.dispatch('retrieveEvents');
                    this.loading = false;
                }
            }
        }
    };
</script>
