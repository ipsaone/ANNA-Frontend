<template>
    <modal name="newEvent" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Create a new event</h1>
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
                    <button type="button" @click.prevent="onSubmit" class="submit">Submit</button>
                </div>
            </form>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';

    export default {
        components: {
            markdownEditor
        },
        data() {
            return {
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
            canSubmit() {
                return this.name.trim() !== '' && this.description.trim() !== '' && this.max >= 0;
            }
        },
        methods: {
            exit() {
                this.$modal.hide('newEvent');
            },
            beforeOpen() {
                this.name = '';
                this.description = '';
                this.max = 0;
                this.start = new Date();
                this.end = new Date();
            },
            onSubmit() {
                
                let evt =  {
                    name: this.name,
                    markdown: this.description,
                    maxRegistered: this.max,
                    startDate: this.start,
                    endDate: this.end
                };


                store.dispatch('storeEvent', evt)
                    .then(() => {
                        this.loading = false;
                        this.$modal.hide('newEvent');
                    })
                    .then(() => {
                        this.loading = false;
                        this.$modal.hide('newEvent');
                    })
                    .then(() => this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'Mission was successfully added',
                        duration: 5000
                    }));
            }
        }
    };
</script>
