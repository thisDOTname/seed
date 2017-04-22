/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-16 18:32:06
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-22 18:19:15
 */

import Vue from 'vue'
import Router from 'vue-router'
import List from '@/modules/todo/List'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/todo',
      name: 'List',
      component: List
    }
  ]
})
