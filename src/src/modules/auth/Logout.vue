<template>
</template>

<script>

import auth from '../../api/auth'
import store from '../../store/index'

export default {
  name: 'logout',
  data () {
    return {
    }
  },
  created: function () {
    this.logMeOut()
  },
  methods: {
    logMeOut () {
      var vm = this
      var component = 'Login'
      auth.methods.logout(vm).then(function (response) {
        store.dispatch('auth/logOutUser')
        vm.$router.push({name: component})
      })
      .catch(function () {
        store.dispatch('auth/logOutUser')
        vm.$router.push({name: component})
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
