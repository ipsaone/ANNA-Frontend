<template>
    <section class="grid">
        <loader v-if="loading"></loader>

        <img src="../../assets/images/logo.png" alt="IPSA ONE logo" class="logo">

        <section class="content">
            <div class="card">
                <h1>A.N.N.A</h1>
                <h2>Admin Network for Nanosat Association </h2>

                <form action="#" method="post">
                    <input type="text" id="username" name="username" v-model="username" placeholder="Username" @keyup.enter="login" autofocus>
                    <input type="password" id="password" name="password" v-model="password" placeholder="Password" @keyup.enter="login">
                    <div class="actions">
                        <a class="button" href="#">Forgot your password?</a>
                        <a class="button" href="#" @click="login">Login</a>
                    </div>
                </form>
            </div>
            <footer>Copyright ©IPSA ONE</footer>
        </section>

    </section>
</template>

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';

    export default {
        components: {
            Loader,
        },
        data() {
            return {
                username: '',
                password: '',
                loading: false
            };
        },
        methods: {
            login() {
                this.loading = true;
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
                        console.log(err);
                        if(err.response.status == 401) {
                            this.$notify({
                                type: 'error',
                                title: 'Couldn\'t log in',
                                text: err.response.data.error ? err.response.data.error : 'No data from server',
                                duration: 5000
                            });
                        } else {
                            this.$notify({
                                type: 'error',
                                title: 'Unknown error',
                                text: err.message,
                                duration: -1
                            });
                        }
                    })
                    .then(_ => {
                        this.loading = false;
                    });
            }
        }
    };
</script>