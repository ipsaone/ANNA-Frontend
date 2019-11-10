<template>
    <modal name="editUser" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal userModal">
            <h1>Edit user</h1>
            <form>
                <div  class="form-group">
                    <label for="user-name">Username :</label>
                    <input type="text" name="user-name" v-model="user_name">
                </div>
                <div class="form-group">
                    <label for="user-email">Email :</label>
                    <input type="text" name="user-email" v-model="user_email">
                </div>
                <div class="form-group">
                    <label for="user-pwd">Password :</label>
                    <input type="password" name="user-pwd" v-model="user_pwd">
                </div>

                <div class="form-group">
                    <label for="user-pwd-2">Password again :</label>
                    <input type="password" name="user-pwd-2" v-model="user_pwd_conf">
                </div>

                <div class="buttons">
                    <button type="button" @click.prevent="$modal.hide('editUser')" class="cancel">Cancel</button>
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
        computed: {
            user() {
                return store.getters.selectedUser;
            },
            canSubmit() {
                return this.user_name.trim() !== '' && this.user_email.includes('@') && this.user_email.includes('.') && this.user_pwd.trim() !== '';
            }
        },
        data() {
            return {
                user_pwd: '',
                user_pwd_conf: '',
                user_name: '',
                user_email: '',
            };
        },
        methods: {
            async beforeOpen(event) {
                await store.dispatch('selectUser', event.params.user_id);
                this.user_name = this.user.username;
                this.user_email = this.user.email;
            },
            async onSubmit() {
                if(this.user_pwd && this.user_pwd != this.user_pwd_conf) {
                    this.$notify({
                        type: 'error',
                        title: 'Please retry',
                        text: 'Passwords don\'t match !',
                        duration: 5000
                    });
                } else {
                    this.loading = true;
                    let user = {
                        username: this.user_name,
                        email: this.user_email
                    };
                    if(this.user_pwd && this.user_pwd == this.user_pwd_conf) {
                        user.password = this.user_pwd;
                    }
                    await store.dispatch('editUser',  {id: this.user.id, user});
                    this.user_name = '';
                    this.user_email = '';
                    this.user_pwd = '';
                    this.user_pwd_conf = '';
                    this.loading = false;
                    this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'User was successfully edited',
                        duration: 5000
                    });
                    this.$modal.hide('editUser');
                }
            }
        }
    };
</script>
