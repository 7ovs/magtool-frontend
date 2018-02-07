<template>
  <v-container fluid class="text-xs-left">
    <v-layout row class="mb-4">
      <v-flex md3 hidden-sm-and-down><v-subheader>Email</v-subheader></v-flex>
      <v-flex md5 xs12>
        <v-text-field v-model="email" label="Email"/>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-4">
      <v-flex md3 hidden-sm-and-down><v-subheader>Order Id</v-subheader></v-flex>
      <v-flex md3 xs12>
        <v-text-field v-model="orderId" label="Order Id"/>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-4">
      <v-flex md3 hidden-sm-and-down><v-subheader>Download count</v-subheader></v-flex>
      <v-flex md3 xs12>
        <v-text-field v-model="downloadCount" label="Download count"/>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-4">
      <v-flex md3 hidden-sm-and-down><v-subheader>Files</v-subheader></v-flex>
      <v-flex md7 xs12>
        <div class="files-tree">
          <ul v-if="!loadingTree">
            <node v-for="node in tree.children" :key="node.path" :node="node"/>
          </ul>
          <v-progress-linear v-else height="2" color="blue-grey lighten-4" :indeterminate="true"></v-progress-linear>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row justify-end class="mt-5">
      <v-flex offset-md3 md7 xs12>
        <v-btn color="primary" @click="submit" class="ma-0">Добавить</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import config from '@/config'
import FilesTreeNode from '@/components/FilesTreeNode'
import Node from '@/classes/files-tree'
export default {
  name: 'CreateLink',
  data () {
    return {
      email: '',
      orderId: '',
      downloadCount: 5,
      loadingTree: true,
      treeData: undefined
    }
  },
  methods: {
    submit () {}
  },
  mounted () {
    this.$http.post(`${config.backend_base}/links`, { command: 'GET_FILES_LIST' })
      .then((res) => {
        this.loadingTree = false
        this.treeData = res.data.data
        const contextId = `ft-${Date.now().toString(36)}`
        this.$store.commit('CREATE_CONTEXT', contextId)
        this.tree = Node.createNode(contextId, { name: '', children: this.treeData })
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

<style lang="sass">
.files-tree
  border: 1px solid #aaa
  padding: 20px 10px
</style>
