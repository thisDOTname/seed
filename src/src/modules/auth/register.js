/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-22 19:04:43
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-03 17:58:58
 */
import auth from '../../api/auth'
import fileApi from '../../api/file'
import store from '../../store/index'
import _ from 'underscore'
import Router from 'vue-router'

var router = new Router()

export default {
  name: 'register',
  data () {
    return {
      agency: {
        agency_id: '',
        company_id: '',
        first_name: '',
        last_name: '',
        email: '',
        organisation_name: '',
        mobile: '',
        telephone: '',
        agency_website: '',
        registered_no: '',
        margin_rates: '',
        payment_terms: '',
        brochure: [],
        notes: '',
        terms_of_business: []
      },
      companyName: '',
      message: '',
      showMessage: false,
      formStep: 0,
      successMessage: '',
      terms_of_business: '',
      brochure: ''
    }
  },
  mounted: function () {
    this.checkIsLoggedIn()
    store.dispatch('auth/setIsRegisterPath', true)
  },
  methods: {
    checkIsLoggedIn: function () {
      if (this.$route.query.c !== undefined) {
        this.companyName = this.$route.query.c
      }

      if (this.isLoggedIn === true) {
        var user = store.getters['auth/getUser']
        this.agency.email = user.email
        if (undefined !== this.$route.params.company_id) {
          store.dispatch('auth/setAgencyCompanyId', this.$route.params.company_id)
          this.agency.company_id = this.$route.params.company_id
        }
      }
    },
    checkAgencyExist: function () {
      var vm = this
      if (this.agency.email === '') {
        this.message = 'Please enter email'
        this.showMessage = true
        return
      }
      this.message = ''
      this.showMessage = false
      if (undefined !== this.$route.params.company_id) {
        store.dispatch('auth/setAgencyCompanyId', this.$route.params.company_id)
        this.agency.company_id = this.$route.params.company_id
      }

      auth.methods.checkAgencyExist(this, this.agency).then(function (response) {
        _.map(response, function (value, key) {
          if (key !== 'brochure' && key !== 'terms_of_business') {
            vm.agency[key] = value
          }
        })
      })
      .catch(function (error) {
        if (error.status === 409) {
          if (error.headers.get('x-exists-company') === 'true') {
            if (vm.isLoggedIn !== true) {
              vm.formStep = 3
              vm.successMessage = 'You have already registered. Please try login'
            } else {
              vm.showMessage = true
              vm.message = 'You have already registered'
            }
          } else if (error.headers.get('x-exists-company') === 'false') {
            vm.formStep = 2
            var resp = error.headers.get('X-Message')
            resp = JSON.parse(resp)
            if (undefined !== resp[0]) {
              resp = resp[0]
            }
            _.map(resp, function (value, key) {
              if (key !== 'brochure' && key !== 'terms_of_business') {
                vm.agency[key] = value
              } else {
                if (key === 'terms_of_business' && value.length !== 0) {
                  vm.agency[key] = [{ id: value[0].id }]
                  fileApi.methods.getFileInfo(vm, value[0].id).then(function (file) {
                    vm.terms_of_business = file.title
                  })
                } else if (key === 'brochure' && value.length !== 0) {
                  vm.agency[key] = [{ id: value[0].id }]
                  fileApi.methods.getFileInfo(vm, value[0].id).then(function (file) {
                    vm.brochure = file.title
                  })
                }
              }
            })
            vm.agencyExist = false
          }
        }
        if (error.status === 404) {
          vm.formStep = 2
        }
      })
    },
    registerMe: function () {
      var vm = this
      if (vm.agency.terms_of_business.length <= 0) {
        this.message = 'Please upload a copy of your terms of buisness'
        this.showMessage = true
        return
      }
      auth.methods.registerAgency(this, this.agency).then(function (response) {
        if (vm.isLoggedIn) {
          vm.showMessage = true
          vm.message = 'You have registered for this company'
        } else {
          vm.successMessage = 'Please check your email for login details'
          vm.formStep = 3
        }
      })
      .catch(function (error) {
        vm.showMessage = true
        vm.message = error.headers.get('x-message') || 'Some error has occured, please try again'
      })
    },
    onFocus: function (key) {
      if (!this.disabled) {
        this.$refs[key].click()
      }
    },
    uploadFile: function (key, $event) {
      var vm = this
      var data = {
        'company_id': vm.agency.company_id,
        'agency_id': vm.agency.agency_id
      }
      var uploadedFiles = vm.$refs[key].files
      var uploadedFileName = ''
      _.each(uploadedFiles, function (item) {
        uploadedFileName = item.name
        var allowedFiles = ['doc', 'docx', 'pdf']
        var extension = item.name.substr(item.name.lastIndexOf('.') + 1)

        if (allowedFiles.indexOf(extension) === -1) {
          vm.showMessage = true
          vm.message = 'Please upload files having extensions: ' + allowedFiles.join(', ') + ' only.'
        } else if (item.size === 0) {
          vm.showMessage = true
          vm.message = 'Uploaded file is empty.'
        } else {
          var FD = new FormData()
          _.each(uploadedFiles, function (item, key) {
            var name = _(item.name.split('/')).reverse()[0]
            FD.append(name, item)
          })
          fileApi.methods.uploadRegisterFile(vm, FD, data)
              .then(function (response) {
                if (response.status === 200) {
                  vm.agency[key] = [{ id: response.body.id }]
                  vm[key] = uploadedFileName
                }
              })
            .catch(function (error) {
                console.log(' FILE UPLOAD ERROR --> ', error)
                router.go('/login')
            })
        }
      })
    }
  },
  computed: {
    isLoggedIn () {
      return store.getters['auth/isLoggedIn']
    }
  }
}
