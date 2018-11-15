<template>
    <modal name="newUser" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <h1>Create a new user</h1>
            <form>
                <div  class="form-group">
                    <label for="user-name">Username :</label><br>
                    <input type="text" name="user-name" v-model="user_name">
                </div>
                <div class="form-group">
                    <label for="user-email">Email :</label><br>
                    <input type="text" name="user-email" v-model="user_email">
                </div>
                <div class="form-group">
                    <label for="user-pwd">Password :</label><br>
                    <input type="password" name="user-pwd" v-model="user_pwd">
                </div>

                <div class="form-group">
                    <label for="user-pwd-2">Password again :</label><br>
                    <input type="password" name="user-pwd-2" v-model="user_pwd_conf">
                </div>

                <div class="buttons">
                    <button type="button" @click.prevent="$modal.hide('newUser')" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="onSubmit" class="submit">Submit</button>
                </div>
            </form>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';

    export default {
        components: {
        },
        data() {
            return {
                user_pwd: '',
                user_pwd_conf: '',
                user_name: '',
                user_email: ''
            };
        },
        computed: {
            canSubmit() {
                return this.user_name.trim() !== '' && this.user_email.includes('@') && this.user_email.includes('.') && this.user_pwd.trim() !== '';
            }
        },
        methods: {
            async onSubmit() {
                if(this.user_pwd != this.user_pwd_conf) {
                    this.$notify({
                        type: 'error',
                        title: 'Please retry',
                        text: 'Passwords don\'t match !',
                        duration: 5000
                    });
                } else if (!this.canSubmit) {
                    this.$notify({
                        type: 'error',
                        title: 'Please check user information',
                        text: 'Invalid name, email or empty password',
                        duration: 5000
                    });
                } else {
                    this.loading = true;
                    store.dispatch('insertUser', {username: this.user_name, email: this.user_email, password: this.user_pwd})
                        .then(() => {
                            this.user_name = '';
                            this.user_email = '';
                            this.user_pwd = '';
                            this.user_pwd_conf = '';
                        })
                        .then(() => {this.loading = false;})
                        .then(() => this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: 'User was successfully added',
                            duration: 5000
                        }))
                        .then(() => {this.$modal.hide('newUser');});
                }
            }
        }
    };
</script>
