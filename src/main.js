// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import VueClipboards from 'vue-clipboards'
import 'vuetify/dist/vuetify.min.css'
// import Config from './plugins/config'
import Backend from './plugins/backend'
import Session from './plugins/session'
import 'mdi/css/materialdesignicons.css'

var config = {
  ...require('@/config/config.json'),
  ...require(`@/config/config.${process.env.NODE_ENV}.json`)
}
console.log(Vue.config.productionTip, config, Vue.config, process.env.NODE_ENV, process.env, process)
store.commit('SET_CONFIG', config)

Vue.use(VueAxios, axios)
Vue.use(Vuetify)
Vue.use(VueClipboards)
// Vue.use(Config, { store })
Vue.use(Backend, { store, http: axios })
Vue.use(Session, { store, http: axios, backend: Vue.app.backend })

Vue.config.productionTip = process.env.NODE_ENV === 'production'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
