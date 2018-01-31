import config from '@/config.json'

var session = null

class Session {
  constructor (store, http) {
    this.$store = store
    this.$http = http
    if (this.isValid) {
      http.defaults.headers.common['X-Access-Token'] = store.state.session.token
    } else {
      this.destroy()
    }
  }

  get iat () {
    const payload = this.payload
    if (payload) return payload.iat
    return undefined
  }

  get token () {
    const session = this.$store.state.session
    if (session && session.token) return session.token
    return undefined
  }

  get header () {
    if (this.$store.state.session.token) {
      return JSON.parse(atob(this.$store.state.session.token.split('.')[0]))
    }
    return undefined
  }

  get payload () {
    if (this.$store.state.session.token) {
      return JSON.parse(atob(this.$store.state.session.token.split('.')[1]))
    }
    return undefined
  }

  async login (username, password) {
    return new Promise((resolve, reject) => {
      this.$http.post(`${config.backend_base}/login`, {
        username: username,
        password: password
      }).then(({ data }) => {
        if (data.status === 'OK' && data.token) {
          console.log('login OK', data)
          this.start(data.token)
          resolve(this)
        } else {
          console.log('login FAIL', data)
          reject(new Error(data.error))
        }
      }).catch((err) => {
        console.log('login FAIL', err)
        reject(new Error(err))
      })
    })
  }

  logout () {
    this.destroy()
    delete this.$http.defaults.headers.common['X-Access-Token']
  }

  start (token) {
    this.$store.commit('SET_SESSION_TOKEN', token)
    this.$http.defaults.headers.common['X-Access-Token'] = token
  }

  async regenerate () {
    // TODO
  }

  destroy () {
    this.$store.commit('RESET_SESSION_TOKEN')
  }

  get isExpired () {
    const payload = this.payload
    if (payload.exp) {
      const now = Math.floor((new Date()).valueOf() / 1000)
      if (payload.exp <= now) return true
    }
    return false
  }

  get isValid () {
    if (!this.token || !this.iat || this.isExpired) return false
    return true
  }
}

Session.install = (Vue, { store, http }) => {
  session = new Session(store, http)
  Vue.session = session
  Object.defineProperties(Vue.prototype, {
    $session: {
      get () {
        return session
      }
    }
  })
}

export default Session
