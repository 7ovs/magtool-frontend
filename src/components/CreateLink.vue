<template>
  <v-container fluid class="text-xs-left">
    <ul v-if="!loadingTree">
      <node v-for="(node, name) in treeData" :key="name" :node="node" :path="name"/>
    </ul>
  </v-container>
</template>

<script>
import config from '@/config'
import FilesTreeNode from '@/components/FilesTreeNode'
export default {
  name: 'CreateLink',
  data () {
    return {
      loadingTree: true,
      treeData: undefined
    }
  },
  mounted () {
    this.$http.post(`${config.backend_base}/links`, { command: 'GET_FILES_LIST' })
      .then((res) => {
        this.loadingTree = false
        this.treeData = res.data.data
        console.log(res.data)
      }).catch(err => {
        console.log('GET_FILES_LIST failed', err)
      })
  },
  components: {
    node: FilesTreeNode
  }
}
</script>
