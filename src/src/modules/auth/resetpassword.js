/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-20 18:34:05
 * @Last Modified by: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Last Modified time: 2017-04-06 15:33:20
 */

import store from '../../store/index'
import auth from '../../api/auth'

export default {
  name: 'resetpassword',
  data () {
    return {
      user: {
        password: '',
        cpassword: ''
      },
      userData: {},
      showNotification: false,
      notificationMessage: '',
      showForm: true,
      successMessage: ''
    }
  },
  created () {
    store.dispatch('auth/logOutUser')
    this.validateToken()
  },
  methods: {
    validateToken: function () {
      var vm = this
      var token = this.$route.params.token
      if (token !== undefined) {
        var data = {
          link: token
        }
        auth.methods.validateToken(vm, data).then(function (response) {
          vm.userData = response
        })
        .catch(function (error) {
          console.log('Token not valid ', error)
        })
      }
    },
    resetPassword: function () {
      var vm = this
      if (vm.user.password !== vm.user.cpassword) {
        vm.showNotification = true
        vm.notificationMessage = 'Password does not match the new password.'
      } else {
        vm.userData.password = vm.user.password
        vm.userData.linkFlag = 0
        auth.methods.resetPassword(vm, vm.userData).then(function (respnse) {
          vm.showForm = false
          vm.successMessage = 'Your password has been changed successfully'
        })
        .catch(function () {
          vm.showNotification = true
          vm.notificationMessage = 'Please enter valid password'
        })
      }
    }
  },
  computed: {
    notify () {
      return store.getters['getNotify']
    }
  }
}
