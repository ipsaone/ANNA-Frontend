<template>
    <modal name="editGroup" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>Change group name</h1>
            <form onsubmit="return false;">
                <input type="text" name="Name" id="Name" placeholder="New name..." v-model="name">

                <div class="buttons">
                    <button type="button" @click.prevent="$modal.hide('editGroup')" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="onSubmit" class="submit">Submit</button>
                </div>
            </form>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde';

    export default {
        components: {
            markdownEditor
        },
        data() {
            return {
                id: 0,
                name: '',
            };
        },
        methods: {
            beforeOpen(event) {
                this.name = event.params.group_name;
                this.id = event.params.group_id;
                console.log('id', this.id);
            },
            async onSubmit() {
                if (this.name) {
                    this.loading = true;
                    console.log('bite', this.id);
                    await store.dispatch('updateGroup', {id: this.id, name: this.name});
                    this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'Group was successfully added',
                        duration: 5000
                    });
                    this.$modal.hide('editGroup');
                }

                return false;
            }
        }
    };
</script>
