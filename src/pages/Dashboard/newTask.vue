<template>
    <modal name="newTask" height="auto" @before-open="beforeOpen" :scrollable="true">
        <div class="content anna-modal">
            <h1>Create a new task</h1>
            <form>
                <input type="text" name="Name" id="Name" placeholder="Name" v-model="name">

                <button type="submit" class="button success" @click.prevent="onSubmit">Submit</button>
            </form>
        </div>
    </modal>
</template>

<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';

    export default {
        data() {
            return {
                name: ''
            };
        },
        methods: {
            beforeOpen(mission) {
                this.name = '';
            },
            async onSubmit() {
                const data = {
                    task: {
                        name: this.name,
                        done: false
                    },
                    missionId: store.getters.selectedMission.id
                };
                if (data.task.name.trim() != '') {
                    await store.dispatch('storeTask', data);
                    await store.dispatch('retrieveMission');
                    this.$modal.hide('newTask');
                } else {
                    this.$notify({
                        type: 'error',
                        title: 'Task name must not be empty',
                        text: 'Please give this task a name',
                        duration: -1
                    });
                }

            }
        }
    };
</script>
