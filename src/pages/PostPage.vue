<template>
    <article>
        <h1>{{ post.title }}</h1>

        <div class="content" v-html="post.content"></div>
    </article>
</template>

<script>
    import store from '@/store';

    export default {
        computed: {
            post() {
                return store.getters.post;
            }
        }
    };
</script>