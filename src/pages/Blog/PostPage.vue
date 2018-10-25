<template>
    <div class="post basic-layout">
        <section class="content">
            <article>
                <div class="wrapper-button-title">
                    <div class="return">
                        <router-link :to="{ name: 'blog'}"> <i class="fa fa-chevron-circle-left"></i> </router-link>
                    </div>
                    <h2>{{ post.title }}</h2>
                </div>

                <p class="info">
                    Posted {{ post.publishedAt | moment('DD/MM/YYYY [at] HH:mm') }} by
                    <router-link :to="{name: 'profile', params:{id: post.author.id}}">{{ post.author.username }}
                    </router-link>
                </p>


                <div class="post-content" v-html="post.content"></div>
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
        async mounted() {
            let id = this.$route.params.id;
            let postIWantToRead = {};
            await store.dispatch('selectPost', id)
                .then(() => {
                    //console.log(this.post, 'trouvé');
                    let postIWantToRead = this.post;
                    store.dispatch('selectPost', postIWantToRead.id)
                        .catch(err => {
                            this.$notify({
                                type: 'error',
                                title: 'Could not find post.',
                                text: `Post #${postIWantToRead.id} does not exist.`,
                                duration: -1
                            });
                        });
                }, () => {
                    //console.log('pas trouvé');
                    store.dispatch('selectDraft', id)
                        .then(() => {
                            //console.log(this.post, 'j\'ai trouvé un draft');
                            let postIWantToRead = this.post;
                            store.dispatch('selectDraft', postIWantToRead.id)
                                .catch(err => {
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
