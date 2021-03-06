var session = null

class Session {
  constructor (store, http, backend) {
    this.$store = store
    this.$http = http
    this.$backend = backend
    this.$config = store.state.config
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
    const session = this.$store.state.session
    if (session.token) {
      if (session.header) return session.header
      const header = JSON.parse(atob(this.$store.state.session.token.split('.')[0]))
      this.$store.commit('SET_HEADER', header)
      return header
    }
    return undefined
  }

  get payload () {
    const session = this.$store.state.session
    if (session.token) {
      if (session.payload) return session.payload
      const payload = JSON.parse(atob(this.$store.state.session.token.split('.')[1]))
      this.$store.commit('SET_PAYLOAD', payload)
      return payload
    }
    return undefined
  }

  async login (username, password) {
    return new Promise((resolve, reject) => {
      this.$backend.login({
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

  update (token) {
    this.$store.commit('UPDATE_SESSION_TOKEN', token)
    this.$http.defaults.headers.common['X-Access-Token'] = token
  }

  async regenerate () {
    return new Promise((resolve, reject) => {
      if (!this.isValid) return reject(new Error('current session isn\'t valid'))
      this.$backend.regen().then(({ data }) => {
        if (data.status === 'OK' && data.token) {
          this.update(data.token)
          resolve(this)
        } else {
          console.log('regenerate FAIL', data)
          reject(new Error(data.error))
        }
      }).catch((err) => {
        console.log('regenerate FAIL', err)
        reject(new Error(err))
      })
    })
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

Session.install = (Vue, { store, http, backend }) => {
  session = new Session(store, http, backend)
  Vue.app.session = session
  Object.defineProperties(Vue.prototype, {
    $session: {
      get () {
        return session
      }
    }
  })
}

export default Session
