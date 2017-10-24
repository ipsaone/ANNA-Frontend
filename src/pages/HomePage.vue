<template>
    <div class='users'>
        <ul>
            <li v-for="user in allUsers" class="user">
                <router-link :to="{name: 'user', params: {id: user.id}}">{{ user.username }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        mounted() {
            this.getAllUsers();
        },
        computed: {
            ...mapGetters([
                'allUsers'
            ])
        },
        methods: {
            ...mapActions([
                'getAllUsers'
            ])
        }
    };
</script>