<template>
    <div>
        <h1>{{ user.username }}</h1>
        <p>{{ user.email }}</p>
    </div>
</template>

<script>
    import store from '@/store';

    export default {
        mounted() {
            store.dispatch('getUserById', this.$route.params.id)
                .then(user => this.user = user)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Could not find the user.',
                        text: `User #${this.$route.params.id} does not exist.`,
                        duration: -1
                    });
                });
        },
        data() {
            return {
                user: {}
            };
        },
    };
</script>
