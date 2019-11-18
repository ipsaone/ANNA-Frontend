<template>
  <modal
    name="editUser"
    height="auto"
    :scrollable="true"
    @before-open="beforeOpen"
  >
    <div class="content anna-modal userModal">
      <h1>Edit user</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="user-name">Username:</label>
          <input
            v-model="user_name"
            type="text"
            name="user-name"
          >
        </div>
        <div class="form-group">
          <label for="user-email">Email:</label>
          <input
            v-model="user_email"
            type="text"
            name="user-email"
          >
        </div>
        <div class="form-group">
          <label for="user-pwd">Password:</label>
          <input
            v-model="user_pwd"
            type="password"
            name="user-pwd"
          >
        </div>

        <div class="form-group">
          <label for="user-pwd-2">Password again:</label>
          <input
            v-model="user_pwd_conf"
            type="password"
            name="user-pwd-2"
          >
        </div>

        <div class="buttons">
          <!--button type="button" @click.prevent="$modal.hide('editUser')" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="onSubmit" class="submit">Submit</button!-->
          <button
            type="button"
            class="cancel"
            @click.prevent="$modal.hide('editUser')"
          >
            Cancel
          </button>
          <button
            id="submitButton"
            type="submit"
            class="button success"
          >
            Submit
          </button>
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
            user_email: '',
        };
    },
    computed: {
        user() {
            return store.getters.selectedUser;
        },
        canSubmit() {
            return this.user_name.trim() !== '' && this.user_email.includes('@') && this.user_email.includes('.') && this.user_pwd.trim() !== '';
        }
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
                await store.dispatch('selectUser', this.user.id).then(_ =>{
                    this.$modal.hide('editUser');
                    this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'User was successfully edited',
                        duration: 5000
                    });
                });

            }
        }
    }
};
</script>
