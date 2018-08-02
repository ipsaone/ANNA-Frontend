<template>
    <div class="blog basic-layout">
        <loader v-if="loading"></loader>

        <section class="content">
            <h1 class="section-title">Blog</h1>
            <template v-if="postsNumber > 0">
                <post-abstract v-for="(post, index) in posts"
                            :key="post.id"
                            :post="post"
                            :index="index +1"
                            @click="selectPost(post.id)">
                </post-abstract>
            </template>
            <template v-else>
                <p class="no-post-message">
                    <b>You're out of luck !</b><br>
                    No blog post was found... Sorry !! :-(
                </p>
            </template>
        </section>

        <section class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li v-show="canPost">
                    <router-link :to="{name: 'newPost'}"><i class="fa fa-plus" aria-hidden="true"></i> New</router-link>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import store from '@/modules/store';
    import PostAbstract from './PostAbstract';
    import Loader from '@/components/Loader';

    export default {
        mounted() {
            // First refresh shows loading
            this.refreshPosts(false, true, false);

            // refresh every 10 seconds
            let interval = setInterval(() => this.refreshPosts(false, true, true), 10000); 
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
            refreshPosts(force = false, hideNotif = false, hideLoader = false) {
                if(!hideLoader) { this.loading = true; }
                store.dispatch('retrievePosts', force)
                    .then(() => {this.loading = false;})
                    .then(_ => {
                        if (!hideNotif) {
                            this.$notify({
                                type: 'success',
                                title: 'Events updated!',
                                duration: 1000
                            });
                        }
                    })
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'Can not retrieve the posts',
                            text: err.message,
                            duration: -1
                        });
                    });
            }
        }
    };
</script>