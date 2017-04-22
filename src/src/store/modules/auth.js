/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-16 18:31:52
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-09 17:19:20
 */
const localStorage = window.localStorage

const namespaced = true

function initState () {
  return {
    user: JSON.parse(localStorage.getItem('user')) || {},
    isLoggedIn: (localStorage.getItem('isLoggedIn') === 'true') ? true : false || false
  }
}

const state = initState()

const mutations = {
  logInSuccess (state) {
    state.isLoggedIn = true
  },
  logInFailure (state) {
    state.isLoggedIn = false
  },
  setLoggedInUser (state, user) {
    state.user = user
  },
  logOutUser (state) {
    state.isLoggedIn = false
  }
}

const actions = {
  logInSuccess (context) {
    localStorage.setItem('isLoggedIn', true)
    context.commit('logInSuccess')
  },
  logInFailure (context) {
    localStorage.setItem('isLoggedIn', false)
    context.commit('logInFailure')
  },
  setLoggedInUser (context, user) {
    localStorage.setItem('user', JSON.stringify(user))
    context.commit('setLoggedInUser', user)
  },
  logOutUser (context) {
    localStorage.clear()
    localStorage.setItem('isLoggedIn', false)
    context.state = initState()
    context.commit('logOutUser')
  }
}

const getters = {
  isLoggedIn: state => {
    return state.isLoggedIn
  },
  getUser: state => {
    console.log('STORE USER -> ', state.user)
    return state.user
  },
  getUserId: state => {
    return state.user.id || '1234'
  }
}

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
