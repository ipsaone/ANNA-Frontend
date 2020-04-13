<template>
    <section class="blog basic-layout">
        <section class="content">
            <h1 class="section-title color-blue">
                Blog
            </h1>
            <template v-if="postsNumber > 0">
                <post-abstract
                    v-for="(post, index) in pinnedPosts"
                    :key="post.id"
                    :post="post"
                    :index="index +1"
                    @click="selectPost(post.id)"
                />

                <div style="height : 2em;" />
                <post-abstract
                    v-for="(post, index) in posts"
                    :key="post.id"
                    :post="post"
                    :index="index +1"
                    @click="selectPost(post.id)"
                />
            </template>
            <template v-else>
                <p class="no-post-message">
                    <b>You're out of luck !</b><br>
                    No blog post was found... Sorry !! :-(
                </p>
            </template>
        </section>

        <section class="actions" style="grid-column: 2;">
            <h1 class="section-title">
                Actions
            </h1>
            <ul>
                <li v-show="canPost">
                    <router-link :to="{ name: 'newPost' }">
                        <i class="fa fa-plus" aria-hidden="true" /> New
                    </router-link>
                </li>
            </ul>
        </section>
    </section>
</template>

<script>
import store from '@/modules/store';
import PostAbstract from './PostAbstract';

export default {
    components: {
        PostAbstract
    },
    data() {
        return {
            loading: false
        };
    },
    computed: {
        posts() {
            return store.getters.posts.filter(p => !p.pinned);
        },
        pinnedPosts() {
            return store.getters.posts.filter(p => p.pinned);
        },
        drafts() {
            return store.getters.drafts;
        },
        postsNumber() {
            return store.getters.posts.length;
        },
        canPost() {
            return store.getters.loggedUserIsRoot;
        }
    },
    async mounted() {
        this.refreshPosts(true, true, false);
    },
    methods: {
        async refreshPosts(force = false, hideNotif = false, hideLoader = false) {
            if (!hideLoader) this.loading = true;
            await store
                .dispatch('retrievePosts', force)
                .then(() => {
                    this.loading = false;
                })
                .then(() => {
                    if (!hideNotif) {
                        this.$notify({
                            type: 'success',
                            title: 'Events updated!',
                            duration: 1000
                        });
                    }
                });
        }
    }
};
</script>
