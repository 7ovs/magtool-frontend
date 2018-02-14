import _ from 'lodash'
import moment from 'moment'
import $store from '@/store'

export default class Link { // MUST BE READONLY!!!
  constructor (linkData) {
    this._id = linkData.id
    if (!$store.state.links[this._id] && $store.state.links[this._id] !== linkData) {
      $store.commit('SET_LINK', linkData)
    }
  }

  get linkData () {
    return $store.state.links[this._id]
  }

  get id () { return this.linkData.id }
  get hash () { return this.linkData.hash }
  get link () { return this.linkData.link }
  get orderId () { return this.linkData.orderId }
  get email () { return this.linkData.email }
  get createdAt () { return moment(this.linkData.created_at) }
  get createdAtRaw () { return this.createdAt.valueOf() }
  get createdBy () { return this.linkData.created_by }
  get files () { return this.linkData.files }
  get downloadsCount () { return this.linkData.downloadsCount }
  get downloadsLimit () { return this.linkData.downloadsLimit }

  get shortHash () { return this.hash.slice(0, 7) }
  get isActive () { return this.downloadsCount < this.downloadsLimit }
  get filesInline () { return this.files.join('; ') }

  get downloadRemains () {
    if (this.isActive) return this.downloadsLimit - this.downloadsCount
    return 0
  }

  get filesDirInline () {
    let dirs = _.chain(this.files)
      .map(item => item.split('/')[0])
      .uniq()
      .sortBy()
      .value()
    return dirs.join('; ') // `${this.files.length} files: ` +
  }

  getFullLink (base) {
    return `${base}${this.link}`
  }

  getSafeLink (base, token) {
    return `${base}${this.link}?token=${token}`
  }
}

Link.update = (linkData) => {
  $store.commit('SET_LINK', linkData)
}

Link.clear = () => {
  $store.commit('CLEAR_LINKS')
}

Link.load = (linksData) => {
  return linksData.map(it => new Link(it))
}

Link.reload = (linksData) => {
  if (!_.isEmpty($store.state.links)) Link.clear()
  return Link.load(linksData)
}

Link.createById = (id) => {
  if ($store.state.links[id]) return new Link($store.state.links[id])
  return undefined
}
