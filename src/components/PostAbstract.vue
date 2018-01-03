<template>
    <article class="flex-abstract post-abstract">
        <p class="id">#{{ index }}</p>
        <h1><router-link :to="{name: 'readPost', params: {id: post.id}}">{{ post.title }}</router-link></h1>
        <p class="info">
            <span class="date">{{ post.publishedAt | moment('DD/MM/YYYY - HH:mm') }}</span>
            <span class="author">By <a href="#">{{ post.author.username }}</a></span>
        </p>
    </article>
</template>

<script>
    import store from '@/store';

    export default {
        props: ['post', 'index']
    };
</script>