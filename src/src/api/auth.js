/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-16 18:33:02
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-09 17:14:04
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/*
const LOGIN_URL = '/auth/login'
const LOGOUT_URL = '/auth/logout'
*/
export default {
  methods: {
    login (context, user) {
      return new Promise((resolve, reject) => {
        setTimeout(
          function () {
            if (Math.random() >= 0.5) {
              var response = {
                status: 200,
                body: {
                  user: {
                    name: 'John Doe',
                    id: '1234'
                  }
                }
              }
              resolve(response)
            } else {
              reject()
            }
          }, 100
        )
/*
        context.$http.post(LOGIN_URL, user).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
*/
      })
    },
    logout (context) {
      return new Promise((resolve, reject) => {
/*
        context.$http.post(LOGOUT_URL).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
*/
      })
    }
  }
}
