/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-04-09 16:52:21
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-04-09 17:38:59
 */

const localStorage = window.localStorage
const namespaced = true

function initState () {
  return {
    list: JSON.parse(localStorage.getItem('todoList')) || {},
    toDoId: ''
  }
}

const state = initState()

const mutations = {
  toDoList (state, toDos) {
    state.list = toDos
  },
  toDoId (state, id) {
    state.toDoId = id
  }
}

const actions = {
  list (context, toDos) {
    localStorage.setItem('todoList', JSON.stringify(toDos))
    context.commit('toDoList', toDos)
  },
  toDoId (context, id) {
    context.commit('toDoId', id)
  }
}

const getters = {
  getToDoList: state => {
    return state.list
  },
  getToDoId: state => {
    return state.toDoId
  }
}

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
