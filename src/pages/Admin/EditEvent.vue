<template>
    <modal name="editEvent" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Edit event</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="event.name">

                <markdown-editor v-model="event.markdown" :configs="configs"></markdown-editor>

                <div class="form-group">
                    <label for="evt_start">Start date :</label>
                    <input type="date" name="evt_start" v-model="startDate">
                </div>

                <div class="form-group">
                    <label for="evt_end">End date :</label>
                    <input type="date" name="evt_end" v-model="endDate">
                </div>

                <div class="form-group">
                    <label for="evt_max">Open slots :</label>
                    <input type="number" name="evt_max" v-model="event.maxRegistered">
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
                startDate: '',
                endDate: '',
                configs: {
                    placeholder: 'Description...',
                    spellChecker: false
                },
            };
        },
        methods: {
            async beforeOpen(event) {
                console.log('LOADING EVENT');
                await store.dispatch('retrieveEvent', event.params.event_id);
                this.startDate = moment(this.event.startDate).format('YYYY-MM-DD');
                this.endDate = moment(this.event.endDate).format('YYYY-MM-DD');
            },
            exit() {
                this.$modal.hide('editEvent');
            },
            async onSubmit() {
                try {
                    this.loading = true;
                    await store.dispatch('updateEvent', {
                        ...this.event,      
                        startDate: this.startDate,
                        endDate: this.endDate
                    });
                    this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'Mission was successfully added',
                        duration: 5000
                    });
                    await store.dispatch('retrieveEvents', true);
                } catch (err) {
                    this.$notify({
                        type: 'error',
                        title: 'Operation failed',
                        text: err,
                        duration: 5000
                    });    
                } finally {
                    this.loading = false;
                }
            }
        }
    };
</script>