<template>
    <modal name="newEvent" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Create a new event</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">
                <markdown-editor v-model="markdown"></markdown-editor>
                <div class="inline-form">
                    <label for="maxRegistered">How many people (no limit if 0): </label>
                    <input type="number" name="maxRegistered" id="maxRegistered" v-model="maxRegistered">
                </div>

                <div class="inline-form">
                    <label for="startDate">Start: </label>
                    <input type="date" name="startDate" id="startDate" v-model="startDate">
                    <label for="startTime">At: </label>
                    <input type="time" name="startTime" id="startTime" v-model="startTime">
                </div>

                <div class="inline-form">
                    <input type="checkbox" v-model="hasEndDate">
                    <label for="endDate">End: </label>
                    <input type="date" name="endDate" id="endDate" v-model="endDate" :disabled="!hasEndDate">
                    <label for="endTime">At: </label>
                    <input type="time" name="endTime" id="endTime" v-model="endTime" :disabled="!hasEndDate">
                </div>

                <button type="submit" class="button success" @click.prevent="onSubmit">Submit</button>
            </form>
        </div>
    </modal>
</template>

<script>
    import store from '@/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';

    export default {
        components: {
            markdownEditor
        },
        data() {
            return {
                name: '',
                markdown: '',
                maxRegistered: 0,
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                hasEndDate: false,
            };
        },
        methods: {
            onSubmit() {
                if (this.startDate === '' || this.startTime === '') {
                    this.$notify({
                        type: 'error',
                        title: 'Start date and time are needed.',
                        duration: -1
                    });
                    return;
                }
                if (this.hasEndDate && (this.endDate === '' || this.endTime === '')) {
                    this.$notify({
                        type: 'error',
                        title: 'End date and time are needed.',
                        duration: -1
                    });
                    return;
                }

                const data = {
                    name: this.name,
                    markdown: this.markdown,
                    maxRegistered: (this.maxRegistered > 0) ? this.maxRegistered : null,
                    startDate: this.startDate + ' ' + this.startTime,
                    endDate: (this.hasEndDate) ? this.endDate + ' ' + this.endTime : null
                };

                store.dispatch('storeEvent', data)
                    .then(this.$modal.hide('newEvent'))
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'Uncaught error',
                            text: err.message,
                            duration: -1
                        });
                    });
            }
        }
    };
</script>