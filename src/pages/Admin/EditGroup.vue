<template>
    <modal
        name="editGroup"
        height="auto"
        :scrollable="true"
        @before-open="beforeOpen"
    >
        <div class="content anna-modal">
            <h1>Change group name</h1>
            <form onsubmit="return false;">
                <input
                    id="Name"
                    v-model="name"
                    type="text"
                    name="Name"
                    placeholder="New name..."
                >

                <div class="buttons">
                    <button
                        type="button"
                        class="cancel"
                        @click.prevent="$modal.hide('editGroup')"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="submit"
                        @click.prevent="onSubmit"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </modal>
</template>


<script>
import store from '@/modules/store';

export default {
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
