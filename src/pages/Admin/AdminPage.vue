<template>
    <section class="admin basic-layout">
        <div class="content">
            <h1 class="section-title">Administration</h1>

            <collapse>
                <div slot="collapse-header">Groups</div>

                <div slot="collapse-body">
                    <input type="text" name="group-name" v-model="group_name">
                    <button type="button" @click.prevent="newGroup">Send</button>
                </div>
            </collapse>

            <collapse>
                <div slot="collapse-header">User list</div>
                <div slot="collapse-body">


                </div>
            </collapse>

            <collapse>
                <div slot="collapse-header">User add</div>
                <div slot="collapse-body">
                    <div class="form-group">
                        <label for="user-name">User name :</label>
                        <input type="text" name="user-name" v-model="user_name">
                    </div>
                    <div class="form-group">
                        <label for="user-email">User email :</label>
                        <input type="text" name="user-email" v-model="user_email">
                    </div>
                    <div class="form-group">
                        <label for="user-pwd">User password :</label>
                        <input type="password" name="user-pwd" v-model="user_pwd">
                    </div>

                    <div class="form-group">
                        <label for="user-pwd-2">User password :</label>
                        <input type="password" name="user-pwd-2" v-model="user_pwd_conf">
                    </div>

                    <button type="button" @click.prevent="newUser">Send</button>
                </div>
            </collapse>
        </div>

        <div class="actions">

        </div>
    </section>
</template>

<script>
    import store from '@/store';
    import Loader from '@/components/Loader';
    import Collapse from '@/components/Collapse';
    import UserApi from '@/api/users';

    export default {
        components: {
            Loader,
            Collapse
        },
        data() {
            return {
                loading: false,
                group_name: '',
                user_name: '',
                user_email: '',
                user_pwd: '',
                user_pwd_conf: ''
            };
        },
        mounted() {
            this.loading = true;
            store.dispatch('retrieveUsers')
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Can not retrieve data from server',
                        text: err.message,
                        duration: -1
                    });
                })
                .then(this.loading = false);
        },
        methods: {
            newGroup() {
                if (group_name)
                    GroupApi.create(group_name);
            },

            newUser() {
                if (this.user_name && this.user_email && this.user_pwd) {
                    if(this.user_pwd != this.user_pwd_conf) {
                        alert('Passwords don\'t match !');
                        return false;
                    }

                    UserApi.add({
                        username: this.user_name,
                        email: this.user_email,
                        password: this.user_pwd
                    }).then(() => this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'User was successfully added',
                        duration: 5000
                    }))
                    .then(() => {
                        this.user_name = '';
                        this.user_email = '';
                        this.user_pwd = '';
                        this.user_pwd_conf = '';
                    })
                    .catch((err) => this.$notify({
                        type: 'error',
                        title: 'Operation failed',
                        text: err,
                        duration: 5000
                    }));
                }
            }

        }
    };
</script>
