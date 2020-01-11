<template>
    <modal
        name="eventModal"
        height="auto"
        :scrollable="true"
        @before-open="beforeOpen"
    >
        <div class="content anna-modal eventModal">
            <h1 v-if="isEditing">
                Edit event
            </h1>
            <h1 v-else>
                Create a new event
            </h1>
            <form>
                <input
                    id="Name"
                    v-model="name"
                    type="text"
                    name="Name"
                    placeholder="Name..."
                />

                <markdown-editor
                    v-model="description"
                    :configs="configs"
                    class="md-editor"
                />

                <div class="form-group">
                    <label for="evt_start">Start date :</label>
                    <datepicker
                        v-model="start"
                        class="datepicker"
                        placeholder="Select Date"
                    />
                </div>

                <div class="form-group">
                    <div class="checkbox-container">
                        <input
                            id="end-option"
                            v-model="end_option"
                            type="checkbox"
                            name="end-option"
                        />
                        <label class="checkbox" for="end-option" />
                    </div>
                    <label for="evt_end">End date :</label>
                    <datepicker
                        v-if="end_option"
                        v-model="end"
                        class="datepicker"
                        placeholder="Select Date"
                    />
                </div>

                <div class="form-group">
                    <div class="checkbox-container">
                        <input
                            id="max-option"
                            v-model="max_option"
                            type="checkbox"
                            name="max-option"
                        />
                        <label class="checkbox" for="max-option" />
                    </div>
                    <label for="evt_max">Open slots :</label>
                    <input
                        v-if="max_option"
                        id="openslots-input"
                        v-model="max"
                        type="number"
                        name="evt_max"
                    />
                </div>

                <div class="buttons">
                    <button type="button" class="cancel" @click.prevent="exit">
                        Cancel
                    </button>
                    <button type="button" class="submit" @click.prevent="onSubmit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </modal>
</template>

<script>
import store from '@/modules/store';
import markdownEditor from 'vue-simplemde';
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
            end: new Date(),
            end_option: false,
            max_option: false,

            configs: {
                placeholder: 'Description...',
                spellChecker: false
            }
        };
    },
    computed: {
        event() {
            return store.getters.selectedEvent;
        },
        canSubmit() {
            return (
                this.name.trim() !== '' &&
        this.description.trim() !== '' &&
        this.max >= 0
            );
        }
    },
    methods: {
        exit() {
            this.$modal.hide('eventModal');
        },
        async beforeOpen(event) {
            this.isEditing = event.params.isEditing;
            if (!this.isEditing) {
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
                let evt = {};
                if (this.max_option && this.end_option) {
                    evt = {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        maxRegistered: this.max,
                        startDate: this.start,
                        endDate: this.end
                    };
                } else if (this.max_option && !this.end_option) {
                    evt = {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        maxRegistered: this.max,
                        startDate: this.start,
                        endDate: null
                    };
                } else if (!this.max_option && this.end_option) {
                    evt = {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        maxRegistered: null,
                        startDate: this.start,
                        endDate: this.end
                    };
                } else if (!this.max_option && !this.end_option) {
                    evt = {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        maxRegistered: null,
                        startDate: this.start,
                        endDate: null
                    };
                }
                console.log('edit ', evt);
                await store.dispatch('updateEvent', {
                    id: this.event.id,
                    event: evt
                });
                this.$modal.hide('eventModal');
                // this.$notify({
                //     type: 'succes',
                //     title: 'Operation successful',
                //     text: 'Event was successfully updated',
                //     duration: 5000
                // });
                await store.dispatch('retrieveEvents');
                this.loading = false;
            } else {
                let evt = {};
                if (this.max_option && this.end_option) {
                    evt = {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        maxRegistered: this.max,
                        startDate: this.start,
                        endDate: this.end
                    };
                } else if (this.max_option && !this.end_option) {
                    evt = {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        maxRegistered: this.max,
                        startDate: this.start
                    };
                } else if (!this.max_option && this.end_option) {
                    evt = {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        startDate: this.start,
                        endDate: this.end
                    };
                } else if (!this.max_option && !this.end_option) {
                    evt = {
                        name: this.name,
                        markdown: this.description.replace(/\n/gi, '\n<br>'),
                        startDate: this.start
                    };
                }
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
