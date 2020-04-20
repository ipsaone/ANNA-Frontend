<template>
    <section class="grid">
        <img src="../../assets/images/logo.png" alt="IPSA ONE logo" class="logo" />

        <section class="content">
            <div class="card">
                <h1>A.N.N.<span class="inverted">A</span></h1>
                <h2>Admin Network for Nanosat Association</h2>

                <form action="#" method="post">
                    <input
                        id="username"
                        v-model="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        autofocus
                        @keyup.enter="login"
                    />
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        @keyup.enter="login"
                    />
                    <div class="actions">
                        <a class="button nopasswd" href="#">Forgot your password?</a>
                        <a id="login_btn" class="button" href="#" @click="login">Login</a>
                    </div>
                </form>
            </div>
        </section>
    </section>
</template>

<script>
import store from '@/modules/store';

export default {
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
            store
                .dispatch('loginUser', {
                    username: this.username,
                    password: this.password
                })
                .then(() => {
                    this.$router.push({ name: 'dashboard' });
                    this.$notify({
                        type: 'success',
                        title: `Welcome back <b>${this.$store.getters.loggedUser.username}</b>`,
                        duration: 5000
                    });
                })
                .catch(() => {
                    this.loading = false;
                })
                .then(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
