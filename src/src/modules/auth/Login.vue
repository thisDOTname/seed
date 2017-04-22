<template>
  <div>
    <h2>Log-in</h2>
      <form name="loginForm" v-on:submit.prevent="logMeIn()" style="border: 1px solid;">
        <p>
          <input type="text" v-model="user.username" required placeholder="Username" />
        </p>
        <p>
          <input type="password" v-model="user.password" required placeholder="Password" />
        </p>
        <p>
          <input type="submit" value="Log-in" />
        </p>
      </form>
      {{notificationMessage}}
  </div>
</template>

<script src="./login.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>


</style>
