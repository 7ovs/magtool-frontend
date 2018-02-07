import _ from 'lodash'
import $store from '@/store'

export const S_NONE = 'none'
export const S_NONE_IND = 'noneind'
export const S_CHECKED_IND = 'checkedind'
export const S_CHECKED = 'checked'

export default class Node {
  constructor (contextId, entry, parent) {
    this.id = contextId
    this.parent = parent
    this.path = parent && parent.path ? `${parent.path}/${entry.name}` : entry.name
  }

  set context (context) {
    $store.commit('SET_CONTEXT', {
      id: context.id,
      path: this.path,
      context
    })
  }

  updateContext (context) {
    $store.commit('UPDATE_CONTEXT', {
      id: this.id,
      path: this.path,
      context
    })
  }

  get context () {
    return $store.state.context[this.id][this.path]
  }

  get isFolder () {
    return this.children !== undefined
  }

  get state () {
    return this.context.state
  }

  set state (newState) {
    $store.commit('UPDATE_CONTEXT', {
      id: this.id,
      path: this.path,
      context: { state: newState }
    })
  }
}

export class FileNode extends Node {
  constructor (contextId, entry, parent) {
    super(contextId, entry, parent)
    let context = {
      id: contextId,
      name: entry.name,
      path: this.path,
      state: S_NONE
    }
    this.context = context
  }

  toggle () {
    let currentState = this.state
    if (currentState === S_NONE) {
      this.state = S_CHECKED
      if (this.parent) this.parent.childChecked(this.path)
    } else if (currentState === S_CHECKED) {
      this.state = S_NONE
      if (this.parent) this.parent.childUnchecked(this.path)
    }
  }

  check () {
    if (this.state === S_NONE) {
      this.state = S_CHECKED
      if (this.parent) this.parent.childChecked(this.path)
    }
  }

  uncheck () {
    if (this.state === S_CHECKED) {
      this.state = S_NONE
      if (this.parent) this.parent.childUnchecked(this.path)
    }
  }
}

export class FolderNode extends Node {
  constructor (contextId, entry, parent) {
    super(contextId, entry, parent)
    let context = {
      id: contextId,
      name: entry.name,
      path: this.path,
      state: S_NONE
    }
    context.checked = []
    context.childTotal = 0
    this.children = []
    for (const name in entry.children) {
      const child = entry.children[name]
      const node = Node.createNode(this.id, child, this)
      if (node.isFolder) context.childTotal += node.childTotal
      else context.childTotal++
      this.children.push(node)
    }
    this.context = context
  }

  updateState () {
    let state
    const total = this.childTotal
    const checked = this.checked.length
    if (checked === 0) state = S_NONE
    else if (checked === total) state = S_CHECKED
    else if (checked < total / 2) state = S_NONE_IND
    else state = S_CHECKED_IND
    this.state = state
    return state
  }

  get childTotal () {
    return this.context.childTotal
  }

  get checked () {
    return this.context.checked
  }

  childChecked (childPath) {
    const update = {
      checked: this.checked.concat([childPath])
    }
    this.updateContext(update)
    this.updateState()
    if (this.parent) this.parent.childChecked(childPath)
  }

  childUnchecked (childPath) {
    const update = {
      checked: _.filter(this.checked, it => { return it !== childPath })
    }
    this.updateContext(update)
    this.updateState()
    if (this.parent) this.parent.childUnchecked(childPath)
  }

  toggle () {
    const state = this.state
    if (state === S_NONE || state === S_NONE_IND) this.check()
    else if (state === S_CHECKED || state === S_CHECKED_IND) this.uncheck()
  }

  check () {
    for (const child of this.children) child.check()
  }

  uncheck () {
    for (const child of this.children) child.uncheck()
  }
}

Node.createNode = function (contextId, entry, parent) {
  if (entry.children) return new FolderNode(contextId, entry, parent)
  return new FileNode(contextId, entry, parent)
}
