/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-20 18:34:05
 * @Last Modified by: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Last Modified time: 2017-04-05 14:42:09
 */

import _ from 'underscore'

export default {
  name: 'page-layout',
  props: ['dataset', 'columns'],
  methods: {
    onRouteClick: function (routeName, routeParams, row) {
      var vm = this
      var routeobject = {}
      _.each(routeParams, function (value, key) {
        routeobject[key] = row[value]
      })
      vm.$router.push({name: routeName, params: routeobject})
    }
  }
}
