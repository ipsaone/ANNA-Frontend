<template>
    <div class="post basic-layout">
        <section class="content">
            <article>
                <h1>{{ post.title }}</h1>

                <p class="info">
                    By
                    <router-link :to="{name: 'profile', params:{id: post.author.id}}">{{ post.author.username }}
                    </router-link>
                    on {{ post.publishedAt | moment('DD/MM/YYYY [at] HH:mm') }}
                </p>

                <div class="content" v-html="post.content"></div>
            </article>
        </section>
        <section class="actions">
            <h1 class="section-title">Actions</h1>

            <ul>
                <li v-show="canEdit">
                    <router-link :to="{name: 'editPost', params:{id: post.id}}"><i class="fa fa-pencil"
                                                                                   aria-hidden="true"></i> Edit
                    </router-link>
                </li>
                <li v-show="canDelete">
                    <a href="#" @click.prevent="deletePost"><i class="fa fa-trash" aria-hidden="true"></i> Delete</a>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import store from '@/modules/store';
    import swal from 'sweetalert2';

    export default {
        mounted() {
            store.dispatch('selectPost', this.$route.params.id)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Could not find the post.',
                        text: `Post #${this.$route.params.id} does not exist.`,
                        duration: -1
                    });
                });
        },
        computed: {
            post() {
                return store.getters.selectedPost;
            },
            canEdit() {
                return (store.getters.selectedPost.id === store.getters.loggedUserId && store.getters.loggedUserIsAuthor)
                    || store.getters.loggedUserIsRoot;
            },
            canDelete() {
                return (store.getters.selectedPost.id === store.getters.loggedUserId && store.getters.loggedUserIsAuthor)
                    || store.getters.loggedUserIsRoot;
            }
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
                }).then(_ => {
                    store.dispatch('deletePost', this.post.id)
                        .then(_ => this.$router.push({name: 'blog'}))
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