<template>
    <section class="blog">
        <h1 class="section-title">Blog</h1>
        <p><a href="#" @click.prevent="reloadPosts">Reload posts</a></p>
        <post-abstract v-for="post in posts" :key="post.id" :post="post" @click="selectPost(post.id)"></post-abstract>
    </section>
</template>

<script>
    import store from '@/store';
    import PostAbstract from '@/components/PostAbstract';

    export default {
        mounted() {
            store.dispatch('retrievePosts')
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Can not retrieve the posts',
                        text: err.message,
                        duration: -1
                    });
                });
        },
        components: {
            PostAbstract
        },
        computed: {
            posts() {
                return store.getters.posts;
            }
        },
        methods: {
            reloadPosts() {
                store.dispatch('updatePosts');
            }
        }
    };
</script>