<template>
    <modal name="changePassword" height="auto" >
        <div class="">
          <h1>Change Password</h1>
          <form>
              <input type="text" name="password" placeholder="new password" v-model="password">
              <input type="text" name="password_verif" placeholder="confirm new password" v-model="password_verif">
          </form>
        </div>
    </modal>
</template>

<script>
export default {};
</script>
