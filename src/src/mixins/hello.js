/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com 
 * @Date: 2017-03-16 18:32:17 
 * @Last Modified by:   Hemant Rai - hemantrai1988@gmail.com 
 * @Last Modified time: 2017-03-16 18:32:17 
 */

module.exports = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
