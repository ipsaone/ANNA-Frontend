<template>
    <section class="post">
        <article>
            <h1>{{ post.title }}</h1>

            <p class="info">By <a href="#">{{ post.author.username }}</a> on {{ post.publishedAt | moment('DD/MM/YYYY [at] HH:mm') }}</p>

            <div class="content" v-html="post.content"></div>
        </article>

        <div class="actions">
            <h1 class="section-title">Actions</h1>

            <ul>
                <li><router-link :to="{name: 'editPost', params:{id: post.id}}"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</router-link></li>
            </ul>
        </div>
    </section>
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