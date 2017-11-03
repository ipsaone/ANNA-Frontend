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
            store.dispatch('selectUser', this.$route.params.id)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Could not find the user.',
                        text: `User #${this.$route.params.id} does not exist.`,
                        duration: -1
                    });
                });
        },
        computed: {
            user() {
                return store.getters.selectedUser;
            }
        }
    };
</script>
