/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com 
 * @Date: 2017-03-16 18:37:47 
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-23 13:57:28
 */

import store from './store/index'
import Router from 'vue-router'

var router = new Router()

export default {
  name: 'app',
  data () {
    return {
      appReady: false,
      sidebar2: false
    }
  },
  computed: {
    isLoggedIn () {
      return store.getters['auth/isLoggedIn']
    },
    user () {
        return store.getters['auth/getUser']
    },
    blockUI () {
      return store.getters['getBlockUI']
    }
  },
  methods: {
  },
  mounted: function () {
  }
}
