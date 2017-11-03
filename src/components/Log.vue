<template>
    <modal class="log-modal" name="log" @before-open="beforeOpen">
        <div class="content">
            <h1>{{ log.title }}</h1>

            <p class="info">By <router-link :to="{name: 'profile', params:{id: authorId}}">{{ username }}</router-link>
                the {{ log.createdAt | moment('DD/MM/YYYY [at] HH:mm') }}</p>

            <p class="description">{{ log.description }}</p>
        </div>
    </modal>
</template>

<script>
    import store from '@/store';

    export default {
        data() {
            return {
                log: {},
                username: '',
                authorId: 0
            };
        },
        methods: {
            beforeOpen(event) {
                store.dispatch('selectLog', event.params.log.id);

                this.log = event.params.log;
                this.username = this.log.author.username;
                this.authorId = this.log.author.id;
            }
        }
    };
</script>