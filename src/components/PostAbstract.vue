<template>
    <article class="abstract">
        <h1><router-link :to="{name: 'readPost', params: {id: post.id}}">{{ post.title }}</router-link></h1>
        <p>{{ abstract }}</p>
    </article>
</template>

<script>
    import striptags from 'striptags';

    export default {
        props: ['post'],
        computed: {
            abstract() {
                return striptags(this.post.content).substr(0, 30).trim() + '...';
            }
        }
    };
</script>