/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com 
 * @Date: 2017-03-16 18:33:30 
 * @Last Modified by:   Hemant Rai - hemantrai1988@gmail.com 
 * @Last Modified time: 2017-03-16 18:33:30 
 */

import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
const localStorage = window.localStorage
const store = new Vuex.Store({
  state: {
    user: {},
    isLoggedIn: false,
    sideMenuItems: [
      { 'id': '1', 'avatar': 'work', 'title': 'Jobs', 'link': '#/job/' },
      { 'id': '2', 'avatar': 'supervisor_account', 'title': 'Clients', 'link': '#/' }
    ],
    selectedTab: '',
    theme: 'light',
    topMenuItems: [
      { 'id': '1', 'avatar': 'notifications', 'title': 'Notifications', 'link': '#/hello/' },
      { 'id': '2', 'avatar': 'exit_to_app', 'title': 'Logout', 'link': '#/' }
    ]
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getSideMenuItems: state => {
      return state.sideMenuItems
    },
    getSelectedTab: state => {
      return state.selectedTab
    },
    getTopMenuItems: state => {
      return state.topMenuItems
    }
  },
  mutations: {
    logInSuccess (state, flag) {
      state.isLoggedIn = flag
      localStorage.setItem('isLoggedIn', flag)
    },
    setLoggedInUser (state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setSelectedTab (state, tab) {
      state.selectedTab = tab
    },
    setTheme (state, theme) {
      state.theme = theme
    }
  },
  strict: true // Disable direct writes to the store, remove for production
})

export default store
