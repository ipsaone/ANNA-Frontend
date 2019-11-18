<template>
    <modal name="newGroup" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Create a new group</h1>
            <form onsubmit="return false;">
                <input type="text" name="Name" id="Name" placeholder="Name..." v-model="name">

                <div class="buttons">
                    <button type="button" @click.prevent="$modal.hide('newGroup')" class="cancel">Cancel</button>
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
            };
        },
        methods: {
            async onSubmit() {
                if (this.name) {
                    await store.dispatch('storeGroup', {name: this.name})
                    .then(_ => {
                        this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: 'Group was successfully added',
                            duration: 5000
                        });
                        this.$modal.hide('newGroup');
                    });
                }
                //return false;
            }
        }
    };
</script>
