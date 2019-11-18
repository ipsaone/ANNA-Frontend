<template>
  <modal
    name="log"
    height="auto"
    :scrollable="true"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
    <div class="content anna-modal">
      <h1>{{ log.title }}</h1>

      <p class="info">
        By <router-link :to="{name: 'profile', params:{id: authorId}}">
          {{ username }}
        </router-link>
        the {{ log.createdAt | moment('DD/MM/YYYY [at] HH:mm') }}
      </p>

      <p
        class="description"
        v-html="log.content"
      />

      <button
        v-show="canDelete"
        v-if="!remove"
        class="button alert"
        @click="deleteLog"
      >
        Delete
      </button>
      <button
        v-show="canDelete"
        v-else
        class="button alert"
        @click="deleteLog"
      >
        Click to confirm
      </button>
    </div>
  </modal>
</template>

<script>
import store from '@/modules/store';

export default {
    data() {
        return {
            log: {},
            username: '',
            authorId: 0,
            remove: false
        };
    },
    computed: {
        canDelete() {
            return this.authorId === store.getters.loggedUserId || store.getters.loggedUserIsRoot;
        }
    },
    methods: {
        beforeOpen(event) {
            store.dispatch('selectLog', event.params.log.id)
                .then(() => {
                    this.log = store.getters.selectedLog;
                    this.username = this.log.author.username;
                    this.authorId = this.log.author.id;
                });
        },
        beforeClose() {
            store.dispatch('unselectLog');
        },
        deleteLog() {
            if (this.remove) {
                store.dispatch('deleteLog', this.log.id)
                    .then(this.$modal.hide('log'));
            }
            this.remove = !this.remove;
        }
    }
};
</script>