<template>
  <modal
    name="changePassword"
    height="auto"
    :scrollable="true"
    @before-open="beforeOpen"
  >
    <div class="content anna-modal userModal">
      <h1>Change Password</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="user-current-pwd">Current password: </label>
          <input
            v-model="user_old_pwd"
            type="password"
            name="user-current-pwd"
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
            user_old_pwd: '',
            user_pwd: '',
            user_pwd_conf: '',
        };
    },
    computed: {
        user() {
            return store.getters.selectedUser;
        }
    },
    methods: {
        async beforeOpen(event) {
            await store.dispatch('selectUser', event.params.user_id);
        },
        async onSubmit() {
            if(this.user_pwd && this.user_pwd !== this.user_pwd_conf) {
                this.$notify({
                    type: 'error',
                    title: 'Please retry',
                    text: 'Passwords don\'t match !',
                    duration: 5000
                });
            } else {
                this.loading = true;
                let user = {};
                if(this.user_pwd && this.user_pwd === this.user_pwd_conf) {
                    user.old_password = this.user_old_pwd;
                    user.password = this.user_pwd;
                    user.password_conf = this.user_pwd_conf;
                }
                console.log('this', this.user);
                console.log('user', user);
                await store.dispatch('changePassword', {user});
                this.user_old_pwd = '';
                this.user_pwd = '';
                this.user_pwd_conf = '';
                this.loading = false;
                await store.dispatch('selectUser', this.user.id).then(_ =>{
                    this.$modal.hide('changePassword');
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
