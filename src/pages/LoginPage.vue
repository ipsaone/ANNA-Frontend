<template>
    <section class="grid">
        <img src="../assets/images/logo.png" alt="IPSA ONE logo" class="logo">

        <section class="content">
            <div class="card">
                <h1>A.N.N.A</h1>
                <h2>Admin Network for Nanosat Association </h2>

                <form>
                    <input type="text" id="username" name="username" v-model="username" placeholder="Username" @keyup.enter="login">
                    <input type="password" id="password" name="password" v-model="password" placeholder="Password" @keyup.enter="login">
                    <div class="actions">
                        <a class="button" href="#">Forgot your password?</a>
                        <a class="button" href="#" @click.prevent="login">Login</a>
                    </div>
                </form>

            </div>
            <footer>Copyright ©IPSA ONE</footer>
        </section>

    </section>
</template>

<script>
    import {mapGetters} from 'vuex';
    import store from '@/store';

    export default {
        data() {
            return {
                username: '',
                password: ''
            };
        },
        methods: {
            login() {
                store.dispatch('loginUser', {username: this.username, password: this.password})
                    .then(_ => {
                        this.$router.push({name: 'dashboard'});
                        this.$notify({
                            type: 'success',
                            title: `Welcome back <b>${this.$store.getters.loggedUser.username}</b>!`,
                            duration: 5000
                        });
                    })
                    .catch(err => {
                        this.$notify({
                            type: 'error',
                            title: 'Unknown credentials.',
                            text: err.message,
                            duration: -1
                        });
                    });
            }
        }
    };
</script>