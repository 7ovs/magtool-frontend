import _ from 'lodash'
import moment from 'moment'

export default class Link {
  constructor (linkData) {
    this.linkData = linkData
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
