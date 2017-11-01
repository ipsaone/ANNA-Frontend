<template>
    <div class="blog">
        <section class="content">
            <h1 class="section-title">Blog</h1>
            <post-abstract v-for="post in posts" :key="post.id" :post="post" @click="selectPost(post.id)"></post-abstract>
        </section>

        <section class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li><a href="#" @click.prevent="refreshPosts" class="refresh"><i class="fa fa-refresh" aria-hidden="true"></i> Refresh</a></li>
            </ul>
        </section>
    </div>
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
            refreshPosts() {
                store.dispatch('retrievePosts', true)
                    .then(_ => {
                        this.$notify({
                            type: 'success',
                            title: 'Blog updated!',
                            duration: 1000
                        });
                    });
            }
        }
    };
</script>