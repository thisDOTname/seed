/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-22 17:13:11
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-03-30 15:54:13
 */

const APPLICANT_LIST_URL = '/agencies/job/applications/'
const APPLICATION_FORM_FIELDS_URL = '/applications/fields/'
const APPLICANT_CHECK_DUPLICATE_URL = '/applications/checkduplicate/'
const CREATE_APPLICATION_URL = '/applications/'
const GET_APPLICATION_URL = '/application/'
const WITHDRAW_APPLICATION_URL = '/applications/withdraw/'

export default {
  methods: {
    getApplications (context, data) {
      var options = {
        params: {
          page_no: 1,
          per_page: 50
        }
      }
      return new Promise((resolve, reject) => {
        context.$http.get(APPLICANT_LIST_URL + data.agencyId + '/' + data.jobId, options).then(response => {
          resolve(response)
        }, response => {
          reject(response)
        })
      })
    },
    getFormFields (context) {
      return new Promise((resolve, reject) => {
        context.$http.get(APPLICATION_FORM_FIELDS_URL).then(response => {
          resolve(response)
        }, response => {
          reject(response)
        })
      })
    },
    checkDuplicateApplicant (context, data) {
      return new Promise((resolve, reject) => {
        context.$http.post(APPLICANT_CHECK_DUPLICATE_URL, data).then(response => {
          resolve(response)
        }, response => {
          reject(response)
        })
      })
    },
    createApplication (context, data) {
      return new Promise((resolve, reject) => {
        context.$http.post(CREATE_APPLICATION_URL, data).then(response => {
          resolve(response)
        }, response => {
          reject(response)
        })
      })
    },
    getApplication (context, applicationId, companyId) {
      return new Promise((resolve, reject) => {
        context.$http.get(GET_APPLICATION_URL + applicationId + '/' + companyId).then(response => {
          resolve(response)
        }, response => {
          reject(response)
        })
      })
    },
    withdrawApplication (context, applicationId, data) {
      return new Promise((resolve, reject) => {
        context.$http.put(WITHDRAW_APPLICATION_URL + applicationId, data).then(response => {
          resolve(response)
        }, response => {
          reject(response)
        })
      })
    }
  }
}
