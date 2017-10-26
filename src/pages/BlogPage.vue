<template>
    <section class="blog">
        <post-abstract v-for="post in allPosts" :key="post.id" :post="post"></post-abstract>
    </section>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import PostAbstract from '@/components/PostAbstract';

    export default {
        components: {
            PostAbstract
        },
        mounted() {
            this.getAllPosts();
        },
        computed: {
            ...mapGetters([
                'allPosts'
            ])
        },
        methods: {
            ...mapActions([
                'getAllPosts'
            ])
        }
    };
</script>