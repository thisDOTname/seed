/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-16 18:32:48
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-09 17:21:05
 */
import auth from '../../api/auth'
import store from '../../store/index'

export default {
  name: 'login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      showNotification: false,
      notificationMessage: ''
    }
  },
  mounted: function () {
    store.dispatch('auth/logOutUser')
  },
  methods: {
    logMeIn () {
      var vm = this
      auth.methods.login(vm, vm.user).then(function (response) {
        store.dispatch('auth/logInSuccess')
        store.dispatch('auth/setLoggedInUser', response.body.user)
        vm.showNotification = true
        vm.notificationMessage = 'Welcome back! :) ' + JSON.stringify(response)
        //vm.$router.push({name: 'Job'})
      })
      .catch(function () {
        vm.showNotification = true
        vm.notificationMessage = 'Incorrect credentials. Please try again.'
        store.dispatch('auth/logInFailure')
      })
    }
  }
}
