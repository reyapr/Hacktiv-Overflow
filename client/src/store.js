import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    search: '',
    questions: '',
    question: '',
    userQuestion: '',
    upVote: 0,
    downVote: 0
  },
  mutations: {
    searchTag (state, payload) {
      state.search = payload
    },
    listQuestion (state, payload) {
      state.questions = payload.slice().reverse()
    },
    selectQuestion (state, payload) {
      state.question = payload
      state.upVote = payload.upVote.length
      state.downVote = payload.downVote.length
    },
    setQuestions (state, payload) {
      state.userQuestion = payload
    }
  },
  actions: {
    searchVal ({commit}, val) {
      commit('searchTag', val)
    },
    getQuestions ({commit}) {
      axios.get('http://localhost:3000/users/question/')
        .then(response => {
          commit('listQuestion', response.data.result)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getQuestion ({ commit }, id) {
      axios.get(`http://localhost:3000/users/question/${id}`)
        .then(response => {
          commit('selectQuestion', response.data.result)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUserQuestions ({ commit }, token) {
      axios.get(`http://localhost:3000/users/question/user`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          commit('setQuestions', response.data.result)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
