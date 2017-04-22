/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-20 18:34:05
 * @Last Modified by: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Last Modified time: 2017-04-06 16:54:15
 */

import store from '../../store/index'
import auth from '../../api/auth'

export default {
  name: 'forgotpassword',
  data () {
    return {
      user: {
        username: '',
        domain_name: window.location.hostname
      },
      showForm: true,
      showNotification: false,
      notificationMessage: '',
      successMessage: ''
    }
  },
  mounted: function () {
    store.dispatch('auth/logOutUser')
  },
  methods: {
    submit: function () {
      var vm = this
      auth.methods.forgotpassword(this, vm.user).then(
        function (response) {
          vm.showForm = false
          vm.successMessage = 'Please check your email and click the secure link.If you don’t see our email, check your spam folder.'
        })
      .catch(function () {
        vm.showNotification = true
        vm.notificationMessage = 'We couldn’t find a agency account associated with' + vm.user.username + '.'
      })
    }
  },
  computed: {
    notify () {
      return store.getters['getNotify']
    }
  }
}
