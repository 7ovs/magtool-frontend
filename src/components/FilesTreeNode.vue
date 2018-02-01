<template>
  <li>
    <v-layout align-center>
      <v-checkbox v-model="checkbox" hide-details class="shrink mr-2"></v-checkbox>
      <span :class="{folder: isFolder}" @click="open = !open">{{ node.name }}</span>
    </v-layout>
    <ul v-show="open" v-if="isFolder">
      <node v-for="(child, name) in node.children" :key="`${path}/${name}`" :node="child" :path="`${path}/${name}`"/>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'node',
  props: ['node', 'path'],
  data () {
    console.log('render', this.node, this.path)
    return {
      open: false,
      checkbox: false
    }
  },
  computed: {
    isFolder () {
      return this.node.children
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
