<template>
  <div class="post basic-layout">
    <section class="content">
      <article>
        <div class="wrapper-button-title">
          <div class="return">
            <router-link :to="{ name: 'blog'}">
              <i class="fa fa-chevron-circle-left" />
            </router-link>
          </div>
          <h2 class="post-title">
            {{ post.title }}
          </h2>
        </div>

        <p class="info">
          Posted {{ post.publishedAt | moment('DD/MM/YYYY [at] HH:mm') }} by
          <router-link :to="{name: 'profile', params:{id: post.author.id}}">
            {{ post.author.username }}
          </router-link>
        </p>


        <div
          class="post-content"
          v-html="post.content"
        />
      </article>
    </section>
    <section class="actions">
      <h1 class="section-title">
        Actions
      </h1>

      <ul>
        <li v-show="canEdit">
          <router-link :to="{name: 'editPost', params:{id: post.id}}">
            <i
              class="fas fa-edit"
              aria-hidden="true"
            /> Edit
          </router-link>
        </li>
        <li v-show="canDelete">
          <a
            href="#"
            @click.prevent="deletePost"
          ><i
            class="fa fa-trash"
            aria-hidden="true"
          /> Delete</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import store from '@/modules/store';
import swal from 'sweetalert2';

export default {
    computed: {
        post() {
            return store.getters.selectedPost;
        },
        canEdit() {
            return store.getters.loggedUserIsAuthor || store.getters.loggedUserIsRoot;
        },
        canDelete() {
            return (store.getters.selectedPost.id === store.getters.loggedUserId && store.getters.loggedUserIsAuthor)
                    || store.getters.loggedUserIsRoot;
        }
    },
    async mounted() {
        let id = this.$route.params.id;
        await store.dispatch('selectPost', id)
            .then(async () => {
                let postIWantToRead = this.post;
                await store.dispatch('selectPost', postIWantToRead.id)
                    .catch(() => {
                        this.$notify({
                            type: 'error',
                            title: 'Could not find post.',
                            text: `Post #${postIWantToRead.id} does not exist.`,
                            duration: -1
                        });
                    });
            }, async () => {
                await store.dispatch('selectDraft', id)
                    .then(() => {
                        let postIWantToRead = this.post;
                        store.dispatch('selectDraft', postIWantToRead.id)
                            .catch(() => {
                                this.$notify({
                                    type: 'error',
                                    title: 'Could not find draft',
                                    text: `Draft #${postIWantToRead.id} does not exist.`,
                                    duration: -1
                                });
                            });
                    });
            });
    },
    methods: {
        deletePost() {
            swal({
                title: 'Delete this post?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#E74D3C',
                cancelButtonColor: '#7A7A7A',
                confirmButtonText: 'Delete'
            }).then(() => {
                store.dispatch('deletePost', this.post.id)
                    .then(() => this.$router.push({name: 'blog'}))
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'Uncaught error',
                            text: err.message,
                            duration: -1
                        });
                    });
            });
        }
    }
};
</script>
