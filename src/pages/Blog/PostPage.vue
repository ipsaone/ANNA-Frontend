<template>
    <section class="post">
        <article>
            <h1>{{ post.title }}</h1>

            <p class="info">By <a href="#">{{ post.author.username }}</a> on {{ post.publishedAt | moment('DD/MM/YYYY [at] HH:mm') }}</p>

            <div class="content" v-html="post.content"></div>
        </article>

        <div class="actions">
            <h1 class="section-title">Actions</h1>

            <ul>
                <li><router-link :to="{name: 'editPost', params:{id: post.id}}"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</router-link></li>
                <li><a href="#" @click.prevent="deletePost"><i class="fa fa-trash" aria-hidden="true"></i> Delete</a></li>
            </ul>
        </div>
    </section>
</template>

<script>
    import store from '@/store';
    import swal from 'sweetalert2';

    export default {
        computed: {
            post() {
                return store.getters.post;
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