/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-04-09 16:13:47
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-09 17:41:02
 */

import toDoAPI from '../../api/todo'
import store from '../../store/index'
import _ from 'underscore'

export default {
  name: 'list',
  data () {
    return {
      toDos: {},
      columns: [
        {
          name: 'id',
          label: 'ID'
        }, {
          name: 'title',
          label: 'Title'
        }, {
          name: 'days_since',
          label: 'Created'
        }, {
          name: 'status',
          label: 'Status'
        }
      ]
    }
  },
  created: function () {
    this.getToDos()
  },
  methods: {
    getToDos: function () {
      var vm = this
      toDoAPI.methods.getToDos(this, vm.userId).then(
        function (response) {
          vm.toDos = response
          console.log(' TODOS --> ', vm.toDos)
        }
      )
      .catch(
        function (error) {
          console.log('ERROR WHILE FETCHING TO-DO List | error : ', error)
        })
    }
  },
  computed: {
    userId () {
      return store.getters['auth/getUserId']
    },
    user () {
        return store.getters['auth/getUser']
    }
  }
}
