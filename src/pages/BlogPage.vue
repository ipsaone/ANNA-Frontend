<template>
    <section class="blog">
        <h1>Blog</h1>
    </section>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        mounted() {
            this.getAllPosts();
        },
        computed: {
            ...mapGetters([
                'allPosts'
            ])
        },
        methods : {
            ...mapActions([
                'getAllPosts'
            ])
        }
    };
</script>