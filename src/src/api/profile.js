/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-20 18:49:36
 * @Last Modified by: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Last Modified time: 2017-03-31 16:50:29
 */

const GET_USER_PROFILE_URL = '/users/'

export default {
  methods: {
    getUserProfile (context, userId) {
      return new Promise((resolve, reject) => {
        context.$http.get(GET_USER_PROFILE_URL + userId).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    },
    updateMaster (context, agencyId, data) {
      return new Promise((resolve, reject) => {
        context.$http.put(GET_USER_PROFILE_URL + agencyId, data).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    }
  }
}
