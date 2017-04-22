/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-16 18:31:38
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-09 16:56:37
 */

import Vuex from 'vuex'
import Vue from 'vue'
import authModule from './modules/auth'
import toDoModule from './modules/todo'

// const localStorage = window.localStorage

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    blockUI: false
  },
  getters: {
    getBlockUI: state => {
      return state.blockUI
    }
  },
  mutations: {
    setBlockUI (state, flag) {
      state.blockUI = flag
    }
  },
  modules: {
    auth: authModule,
    todo: toDoModule
  },
  strict: true // Disable direct writes to the store, remove for production
})

export default store
