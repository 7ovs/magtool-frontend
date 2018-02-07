<template>
  <li>
    <v-layout align-center>
      <v-checkbox @click="node.toggle()" :input-value="checkboxState" :indeterminate="indeterminateState" value hide-details class="shrink mr-2"></v-checkbox>
      <span :class="{folder: node.isFolder}" @click="open = !open">{{ node.context.name }}</span>
    </v-layout>
    <ul v-show="open" v-if="node.isFolder">
      <node v-for="node in node.children" :key="node.path" :node="node"/>
    </ul>
  </li>
</template>

<script>
import {S_NONE, S_NONE_IND, S_CHECKED_IND, S_CHECKED} from '@/classes/files-tree'

export default {
  name: 'node',
  props: ['node'],
  data () {
    return {
      open: false
    }
  },
  computed: {
    state () {
      if (this.node && this.node.state) return this.node.state
      return S_NONE
    },
    checkboxState () {
      return this.state === S_CHECKED || this.state === S_CHECKED_IND
    },
    indeterminateState () {
      return this.state === S_NONE_IND || this.state === S_CHECKED_IND
    }
  }
}
</script>

<style lang="sass" scoped>
li
  color: white
  list-style: none
  text-align: left
  ul
    padding-left: 40px
.folder
  font-weight: bolder
  cursor: pointer
</style>
