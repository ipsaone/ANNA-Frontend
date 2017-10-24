<template>
    <div>
        <h1>{{ user.name }}</h1>
        <p>{{ user.email }}</p>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    export default {
        computed: {
            ...mapGetters([
                'allUsers'
            ]),
            user() {
                const id = parseInt(this.$route.params.id);
                return this.allUsers.find(user => user.id === id) || {};
            }
        },
        methods: {
            ...mapActions([
                'getAllUsers'
            ])
        }
    };
</script>
