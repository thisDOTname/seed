/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-29 12:07:07
 * @Last Modified by: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Last Modified time: 2017-03-30 14:37:19
 */

const CLIENT_LIST_URL = '/companies/agencies/'
const CLIENT_DETAILS_URL = '/companies/profile/'
const UPDATE_CLIENT_URL = '/companies/profile/'
const USER_DETAILS_URL = '/users/'

export default {
  methods: {
    getClients (context, agencyId) {
      return new Promise((resolve, reject) => {
        context.$http.get(CLIENT_LIST_URL + agencyId).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    },
    getClientDetailsById (context, agencyId, clientId) {
      return new Promise((resolve, reject) => {
        context.$http.get(CLIENT_DETAILS_URL + agencyId + '/' + clientId).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    },
    getUserDetails (context, userId) {
      return new Promise((resolve, reject) => {
        context.$http.get(USER_DETAILS_URL + userId).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    },
    updateClient (context, agencyId, clientId, data) {
      var url = UPDATE_CLIENT_URL + agencyId
      if (clientId !== 'master') {
        url += '/' + clientId
      }
      return new Promise((resolve, reject) => {
        context.$http.put(url, data).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    }
  }
}
