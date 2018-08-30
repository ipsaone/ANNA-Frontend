<template>
    <router-link :to="{name: 'readPost', params: {id: post.id}}">
        <article class="flex-abstract post-abstract">
            <p class="id">#{{ post.id }}</p>
            <h1>{{ post.title }}</h1>
            <p class="info">
                <span class="date">{{ post.publishedAt | moment('DD/MM/YYYY - HH:mm') }}</span>
                <span class="author">By <a href="#">{{ post.author.username }}</a></span>
            </p>
        </article>
    </router-link>
</template>

<script>
    import store from '@/modules/store';

    export default {
        props: ['post', 'index']
    };
</script>