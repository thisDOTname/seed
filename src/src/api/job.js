/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-20 18:49:36
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-03-29 14:17:44
 */

import moment from 'moment'
import _ from 'underscore'

const JOB_DETAILS_URL = '/job/'
const JOB_LIST_URL = '/agencies/job/released/'

export default {
  methods: {
    getJobs (context, agencyId) {
      var options = {
        params: {
          page_no: 1,
          per_page: 50
        }
      }
      return new Promise((resolve, reject) => {
        context.$http.get(JOB_LIST_URL + agencyId, options).then(response => {
          var jobs = response.body[0].records
          _.each(jobs, function (job) {
            job.applicants = job.app_cnt
            job.submit_applicant = true
            if (job.released_date && !_.isEmpty(job.released_date)) {
              job.days_since_released = moment(job.released_date, 'YYYY-MM-DD HH:mm:ss').fromNow()
            } else {
              job.days_since_released = 'N/A'
            }
          })
          resolve(jobs)
        }, response => {
          reject(response)
        })
      })
    },
    getJob (context, jobId) {
      return new Promise((resolve, reject) => {
        context.$http.get(JOB_DETAILS_URL + jobId).then(response => {
          resolve(response)
        }, response => {
          reject(response)
        })
      })
    }
  }
}
