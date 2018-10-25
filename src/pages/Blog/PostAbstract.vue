<template>
    <router-link :to="{name: 'readPost', params: {id: post.id}}">
        <article class="flex-abstract post-abstract">
            <p class="id">#{{ post.id }}</p>
            <h1>{{ post.title }}</h1>
            <p class="info">
                <span class="date"><span v-if='!post.publishedAt'>Draft</span>{{ post.publishedAt | moment('DD/MM/YYYY - HH:mm') }}</span>
                <span class="author">By <router-link :to="{name: 'profile', params:{id: post.author.id}}">{{ post.author.username }}</router-link></span>
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
