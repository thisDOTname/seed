/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-04-09 16:20:21
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-09 17:42:25
 */

/*
import moment from 'moment'
import _ from 'underscore'
*/
// const TODO_LIST_URL = '/todo/'
const TODO_DETAILS_URL = '/todo/details/'

export default {
  methods: {
    getToDos (context, userId) {
      return new Promise((resolve, reject) => {
        /*
            context.$http.get(TODO_LIST_URL + userId).then(response => {
            resolve(response)
            }, response => {
            reject(response)
            })
        */
        var toDoTemplate = [
          {
            id: '1',
            title: 'Foo',
            created_on: '1',
            status: 'Active'
          }
        ]
        resolve(toDoTemplate)
      })
    },
    getToDoDetails (context, toDoId) {
      return new Promise((resolve, reject) => {
        context.$http.get(TODO_DETAILS_URL + toDoId).then(response => {
          resolve(response)
        }, response => {
          reject(response)
        })
      })
    }
  }
}
