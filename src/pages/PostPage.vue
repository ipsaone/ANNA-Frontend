<template>
    <article>
        <h1>{{ selectedPost.title }}</h1>

        <div class="content" v-html="selectedPost.content"></div>
    </article>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        mounted() {
            this.getPost(this.$route.params.id);
        },
        computed: {
            ...mapGetters([
                'selectedPost'
            ])
        },
        methods: {
            ...mapActions([
                'getPost'
            ])
        }
    };
</script>