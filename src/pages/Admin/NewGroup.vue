<template>
  <modal
    name="newGroup"
    height="auto"
    :scrollable="true"
  >
    <div class="content anna-modal">
      <h1>Create a new group</h1>
      <form onsubmit="return false;">
        <input
          id="Name"
          v-model="name"
          type="text"
          name="Name"
          placeholder="Name..."
        >

        <div class="buttons">
          <button
            type="button"
            class="cancel"
            @click.prevent="$modal.hide('newGroup')"
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
            name: '',
        };
    },
    methods: {
        async onSubmit() {
            if (this.name) {
                await store.dispatch('storeGroup', {name: this.name})
                    .then(() => {
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
