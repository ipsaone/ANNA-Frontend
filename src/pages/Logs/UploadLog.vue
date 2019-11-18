<template>
  <modal
    name="uploadLog"
    height="auto"
    :scrollable="true"
  >
    <div class="content anna-modal">
      <h1>Create a new log</h1>
      <form @submit.prevent="onSubmit">
        <input
          id="title"
          v-model="title"
          type="text"
          name="title"
          placeholder="Title..."
        >
        <markdown-editor
          v-model="markdown"
          :configs="configs"
        />
        <button
          type="submit"
          class="button success"
        >
          Submit
        </button>
      </form>
    </div>
  </modal>
</template>

<script>
import store from '@/modules/store';
import logsApi from '@/modules/logs/logs_api';
import markdownEditor from 'vue-simplemde';

export default {
    components: {
        markdownEditor
    },
    data() {
        return {
            title: '',
            markdown: '',

            configs: {
                placeholder: 'Description'
            }
        };
    },
    methods: {
        onSubmit() {
            const data = {
                title: this.title,
                markdown: this.markdown,
                authorId: store.getters.loggedUserId
            };
            store.dispatch('storeLog', data)
                .then(this.$modal.hide('uploadLog'))
                .then(_ => {
                    this.title = '';
                    this.markdown = '';
                })
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