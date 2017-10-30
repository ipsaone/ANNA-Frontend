<template>
  <div class="background">

    <div class="login">
        <img src="../assets/images/logo.png" alt="IPSA ONE logo" class="logo" @click.prevent="redirectToHome">

        <form class="connexion">
          <span class= "first-title">A.N.N.A.</span>
          <span class= "second-title"> Admin Network for Nanosat Association </span>

          <input type="text" id="user" class="inp" placeholder="Login">
          <input type="password" id="password" class=  "inp" placeholder="Password">
         <div class="button">
           <input class="button1" type="button" value="Mot de passe oublié">
           <input class="button1" type="submit" value="Connexion">
         </div>
      </form>

      <div class="copyright"> Copyright ©IPSA ONE </div>

    </div>
  </div>
</template>
