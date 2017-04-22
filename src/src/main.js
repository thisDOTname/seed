/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-16 18:31:23
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-19 23:13:17
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'

Vue.use(Vuex)
Vue.use(VueResource)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
