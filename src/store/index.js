import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  session: {}
}
const mutations = {
  SET_SESSION_TOKEN (state, token) {
    console.log('SET_SESSION_TOKEN')
    Vue.set(state, 'session', { token })
  },
  RESET_SESSION_TOKEN (state) {
    console.log('RESET_SESSION_TOKEN')
    Vue.set(state, 'session', {})
  }
}

const getters = {}

const actions = {}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  plugins: [createPersistedState()]
})

export default store
