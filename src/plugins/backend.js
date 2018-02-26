var backend = null

class Backend {
  constructor (store, http) {
    this.$store = store
    this.$http = http
    this.$config = store.state.config
  }

  get baseUrl () { return this.$config.baseUrl }
  get downloadBaseUrl () { return this.$config.downloadBaseUrl }

  getUrl (path) { return `${this.$config.baseUrl}${path}` }
  getDownloadUrl (path) { return `${this.$config.downloadBaseUrl}${path}` }
  getSafeDownloadUrl (path, token) { return `${this.getDownloadUrl(path)}?token=${token}` }

  login (auth) { return this.$http.post(this.getUrl('/login'), auth) }
  regen () { return this.$http.post(this.getUrl('/regen')) }

  get control () {
    const url = this.getUrl('/control')
    const post = this.$http.post
    return {
      ping: () => post(url, { command: 'PING' }),
      resetApache: () => post(url, { command: 'RESET_APACHE' }),
      resetVarnish: () => post(url, { command: 'RESET_VARNISH' }),
      getLog: () => post(url, { command: 'GET_LOG' }),
      cleanCache: () => post(url, { command: 'CLEAN_CACHE' })
    }
  }

  get links () {
    const url = this.getUrl('/links')
    const post = this.$http.post
    return {
      getFilesList: () => post(url, { command: 'GET_FILES_LIST' }),
      getLinks: () => post(url, { command: 'GET_LINKS' }),
      createLink: (linkData) => post(url, { command: 'CREATE_LINK', data: linkData }),
      deleteLink: (id) => post(url, { command: 'DELETE_LINK', id }),
      resetCounter: (id, newCount) => post(url, { command: 'RESET_COUNTER', id, count: newCount })
    }
  }

  get profile () {
    const url = this.getUrl('/profile')
    const post = this.$http.post
    return {
      changePassword: (currentPassword, newPassword) => post(url, {
        command: 'CHANGE_PASSWORD',
        data: {
          password: currentPassword,
          new_password: newPassword
        }
      })
    }
  }
}

Backend.install = (Vue, { store, http }) => {
  if (!Vue.app) Vue.app = {}
  backend = new Backend(store, http)
  Vue.app.backend = backend
  Object.defineProperties(Vue.prototype, {
    $backend: {
      get () {
        return backend
      }
    }
  })
}

export default Backend
