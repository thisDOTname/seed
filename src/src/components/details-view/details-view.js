/*
 * @Author: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Date: 2017-03-20 18:34:05
 * @Last Modified by: Vaishali Ghayal - vaishali.ghayal@gmail.com
 * @Last Modified time: 2017-04-05 17:42:26
 */

import _ from 'underscore'
import Files from '../../api/file'
import store from '../../store/index'

export default {
  name: 'details-view',
  data () {
    return {
      showPreview: false,
      showNotification: false,
      notificationMessage: '',
      previewUrl: '',
      frameTitle: ''
    }
  },
  props: ['dataset', 'flatcard'],
  methods: {
    filePreview: function (file) {
      var vm = this
      if (file.preview_zip_url) {
        vm.frameTitle = file.title
        vm.previewUrl = file.preview_zip_url
        vm.showPreview = true
      }
    },
    downloadFile: function (fileObj) {
      Files.methods.getFileDownloadLink(this, fileObj.id).then(function (response) {
        window.open(response.downloadable_url, '_blank')
      })
    },
    copyTextToClipboard: function (text) {
      var vm = this
      var textArea = document.createElement('textarea')

      textArea.style.position = 'fixed'
      textArea.style.top = 0
      textArea.style.left = 0
      textArea.style.width = '2em'
      textArea.style.height = '2em'
      textArea.style.padding = 0
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()

      try {
        var successful = document.execCommand('copy')
        successful ? 'successful' : 'unsuccessful'
        if (successful) {
          vm.showNotification = true
          vm.notificationMessage = 'Text has been copied to your clipboard'
        } else {
          vm.showNotification = true
          vm.notificationMessage = 'Copy to clipboard failed! Please try again or manually copy the text'
        }
      } catch (err) {
        vm.showNotification = true
        vm.notificationMessage = 'Copy to clipboard failed! Please try again or manually copy the text'
      }

      document.body.removeChild(textArea)
    },
    getChoiceLabel: function (field) {
      return _.filter(field.options, function (option) { return option.id === field.value })[0].label || 'N/A'
    },
    getPlainText: function (html) {
      return html ? String(html).replace(/<[^>]+>/gm, '') : ''
    }
  },
  computed: {
    notify () {
      return store.getters['getNotify']
    }
  }
}
