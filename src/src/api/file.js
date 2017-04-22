/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-22 14:49:14
 * @Last Modified by: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Last Modified time: 2017-03-31 19:00:05
 */

import _ from 'underscore'

const FILE_URL = '/files/'
const GET_AGENCY_FILE = '/users/agencies/files?file_id='
const UPDATE_FILE_URL = '/files?id='
const UPLOAD_CV_URL = '/applications/cv/'
const UPLOAD_REGISTER_FILE = '/users/agencies/upload'
const UPLOAD_FILE_URL = '/files/new'

export default {
  methods: {
    getFileById (context, files) {
      return new Promise((resolve, reject) => {
        var filesArray = []
        _.each(files, function (file) {
          context.$http.get(FILE_URL + file.id).then(response => {
            var data = response.body
            if (data.visibility === 'true') {
              filesArray.push(data)
            }
          }, (response) => {
            reject(response)
          })
        })
        resolve(filesArray)
      })
    },
    getFileDownloadLink (context, id) {
      return new Promise((resolve, reject) => {
        context.$http.get(FILE_URL + id + '/url').then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    },
    getFileInfo (context, id) {
      return new Promise((resolve, reject) => {
        context.$http.get(GET_AGENCY_FILE + id).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    },
    uploadFile (context, fd, data) {
      var options = {
        headers: {
          'Content-Type': undefined,
          'x-company-id': data.company_id
        }
      }

      return new Promise((resolve, reject) => {
        context.$http.post(UPLOAD_CV_URL, fd, options).then(response => {
          resolve(response)
        }, (response) => {
          reject(response)
        })
      })
    },
    uploadRegisterFile (context, fd, data) {
      var options = {
        headers: {
          'Content-Type': undefined,
          'x-company-id': data.company_id,
          'agency_id': data.agency_id
        }
      }

      return new Promise((resolve, reject) => {
        context.$http.post(UPLOAD_REGISTER_FILE, fd, options).then(response => {
          resolve(response)
        }, (response) => {
          reject(response)
        })
      })
    },
    updateFile (context, fileId, resourceId) {
      var data = {
        'resource_entity_id': resourceId
      }
      return new Promise((resolve, reject) => {
        context.$http.post(UPDATE_FILE_URL + fileId, data).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    },
    uploadImageFile (context, fd) {
      var options = {
        headers: {
          'Content-Type': undefined,
          'x-plugin-task-image-resize': 'profile',
          'x-resource-type': 'image'
        }
      }

      return new Promise((resolve, reject) => {
        context.$http.post(UPLOAD_FILE_URL, fd, options).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    },
    getImageFileInfo (context, id) {
      return new Promise((resolve, reject) => {
        context.$http.get(FILE_URL + id).then(response => {
          resolve(response.body)
        }, (response) => {
          reject(response)
        })
      })
    }
  }
}
