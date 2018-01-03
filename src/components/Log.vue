<template>
    <modal name="log" @before-open="beforeOpen" @before-close="beforeClose" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>{{ log.title }}</h1>

            <p class="info">By <router-link :to="{name: 'profile', params:{id: authorId}}">{{ username }}</router-link>
                the {{ log.createdAt | moment('DD/MM/YYYY [at] HH:mm') }}</p>

            <p class="description" v-html="log.content"></p>

            <button @click="deleteLog" class="button alert" v-show="canDelete">Delete</button>
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
        computed: {
            canDelete() {
                return this.authorId === store.getters.loggedUserId || store.getters.loggedUserIsRoot;
            }
        },
        methods: {
            beforeOpen(event) {
                store.dispatch('selectLog', event.params.log.id)
                    .then(_ => {
                        this.log = store.getters.selectedLog;
                        this.username = this.log.author.username;
                        this.authorId = this.log.author.id;
                    });
            },
            beforeClose(event) {
                store.dispatch('unselectLog');
            },
            deleteLog() {
                store.dispatch('deleteLog', this.log.id)
                    .then(this.$modal.hide('log'));
            }
        }
    };
</script>