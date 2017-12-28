<template>
    <div class="blog basic-layout">
        <loader v-if="loading"></loader>

        <section class="content">
            <h1 class="section-title">Blog</h1>
            <post-abstract v-if="postsNumber > 0"
                           v-for="(post, index) in posts"
                           :key="post.id"
                           :post="post"
                           :index="index +1"
                           @click="selectPost(post.id)">
            </post-abstract>
        </section>

        <section class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li>
                    <a href="#" @click.prevent="refreshPosts(true)"><i class="fa fa-refresh" aria-hidden="true"></i>
                        Refresh</a>
                </li>
                <li v-show="canPost">
                    <router-link :to="{name: 'newPost'}"><i class="fa fa-plus" aria-hidden="true"></i> New</router-link>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import store from '@/store';
    import PostAbstract from '@/components/PostAbstract';
    import Loader from '@/components/Loader';

    export default {
        mounted() {
            this.retrievePosts();
        },
        data() {
            return {
                loading: false
            };
        },
        components: {
            PostAbstract,
            Loader
        },
        computed: {
            posts() {
                return store.getters.posts;
            },
            postsNumber() {
                return this.posts.length;
            },
            canPost() {
                return store.getters.loggedUserIsAuthor || store.getters.loggedUserIsRoot;
            }
        },
        methods: {
            refreshPosts(force = false) {
                this.loading = true;
                store.dispatch('retrievePosts', force)
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'Can not retrieve the posts',
                            text: err.message,
                            duration: -1
                        });
                    })
                    .then(_ => {
                        this.loading = false;
                    });
            }
        }
    };
</script>