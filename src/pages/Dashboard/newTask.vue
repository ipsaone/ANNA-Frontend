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
                name: '',
                mission: {}
            };
        },
        methods: {
            beforeOpen(mission) {
                this.mission = mission.params;
                console.log(this.mission);
            },
            onSubmit() {
                const data = {
                    task: {
                        name: this.name,
                        done: false
                    },
                    missionId: this.mission.id
                };

                store.dispatch('storeTask', data)
                    .then(() => this.$modal.hide('newTask'))
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