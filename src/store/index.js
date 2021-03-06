import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  links: {},
  config: {},
  session: {},
  context: {}
}

const mutations = {
  SET_SESSION_TOKEN (state, token) {
    console.log('SET_SESSION_TOKEN')
    Vue.set(state, 'session', { token })
  },
  RESET_SESSION_TOKEN (state) {
    console.log('RESET_SESSION_TOKEN')
    Vue.set(state, 'session', {})
  },
  UPDATE_SESSION_TOKEN (state, token) {
    console.log('UPDATE_SESSION_TOKEN')
    Vue.set(state, 'session', { token })
  },
  SET_PAYLOAD (state, payload) {
    console.log('SET_PAYLOAD')
    Vue.set(state.session, 'payload', payload)
  },
  SET_HEADER (state, header) {
    console.log('SET_HEADER')
    Vue.set(state.session, 'header', header)
  },
  CREATE_CONTEXT (state, id) {
    console.log('CREATE_CONTEXT', id)
    Vue.set(state.context, id, {})
  },
  SET_CONTEXT (state, {id, path, context}) {
    console.log('SET_CONTEXT', id, path, context)
    Vue.set(state.context[id], path, context)
  },
  UPDATE_CONTEXT (state, { id, path, context }) {
    console.log('UPDATE_CONTEXT', {id, path, context})
    const currentContext = state.context[id][path]
    if (currentContext) {
      state.context[id][path] = {
        ...currentContext,
        ...context
      }
    } else {
      state.context[id][path] = { ...context }
    }
  },
  SET_CONFIG (state, config) {
    console.log('SET_CONFIG', config)
    Vue.set(state, 'config', config)
  },
  SET_LINK (state, linkData) {
    console.log('SET_LINK', linkData)
    Vue.set(state.links, linkData.id, linkData)
  },
  CLEAR_LINKS (state) {
    console.log('CLEAR_LINKS')
    Vue.set(state, 'links', {})
  }
}

const getters = {}

const actions = {}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  plugins: [createPersistedState({ paths: ['session'] })]
})

export default store
