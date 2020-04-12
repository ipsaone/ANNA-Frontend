<template>
    <modal name="newUser" height="auto" :scrollable="true">
        <div class="content anna-modal userModal">
            <h1>Create a new user</h1>
            <form>
                <div class="form-group">
                    <label for="user-name">Username :</label>
                    <input v-model="user_name" type="text" name="user-name" />
                </div>
                <div class="form-group">
                    <label for="user-email">Email :</label>
                    <input v-model="user_email" type="text" name="user-email" />
                </div>
                <div class="form-group">
                    <label for="user-pwd">Password :</label>
                    <input v-model="user_pwd" type="password" name="user-pwd" />
                </div>

                <div class="form-group">
                    <label for="user-pwd-2">Password again :</label>
                    <input v-model="user_pwd_conf" type="password" name="user-pwd-2" />
                </div>

                <div class="form-group">
                    <label for="user-pwd-2">Send email to user :</label>
                    <input
                        v-model="user_send_email"
                        type="checkbox"
                        name="user-send-email"
                    />
                </div>

        <div class="form-group">
          <label for="user-pwd-2">Send email to user :</label>
          <input
            v-model="user_send_email"
            type="checkbox"
            name="user-send-email"
          >
        </div>

        <div class="buttons">
          <button
            type="button"
            class="cancel"
            @click.prevent="$modal.hide('newUser')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="submit"
            @click.prevent="onSubmit"
          >
            Submit
          </button>
        </div>
    </modal>
</template>

<script>
import store from '@/modules/store';

export default {
    components: {},
    data() {
        return {
            user_pwd: '',
            user_pwd_conf: '',
            user_name: '',
            user_email: '',
            user_send_email: true
        };
    },
    computed: {
        canSubmit() {
            return (
                this.user_name.trim() !== '' &&
        this.user_email.includes('@') &&
        this.user_email.includes('.') &&
        this.user_pwd.trim() !== ''
            );
        }
    },
    methods: {
        async onSubmit() {
            if (this.user_pwd != this.user_pwd_conf) {
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
                store
                    .dispatch('insertUser', {
                        username: this.user_name,
                        email: this.user_email,
                        password: this.user_pwd,
                        sendEmail: this.user_send_email
                    })
                    .then(() => {
                        this.user_name = '';
                        this.user_email = '';
                        this.user_pwd = '';
                        this.user_pwd_conf = '';
                        this.user_send_email = true;
                    })
                    .then(() => {
                        this.loading = false;
                    })
                    .then(() =>
                        this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: 'User was successfully added',
                            duration: 5000
                        })
                    )
                    .then(async () => {
                        await store.dispatch('retrieveGroups', true);
                    })
                    .then(() => {
                        this.$modal.hide('newUser');
                    });
            }
        }
    }
};
</script>
