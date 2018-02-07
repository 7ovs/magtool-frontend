<template>
  <v-container fluid class="text-xs-left">
    <v-dialog v-model="resultDialog" persistent max-width="640">
      <v-card>
        <v-card-title class="headline">Link successfully created!</v-card-title>
        <v-card-text>
          <v-text-field v-model="link" readonly/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="$router.push('/links')">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row class="mb-4">
      <v-flex md3 hidden-sm-and-down><v-subheader>Email</v-subheader></v-flex>
      <v-flex md5 xs12>
        <v-text-field v-model="newLink.email" label="Email"/>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-4">
      <v-flex md3 hidden-sm-and-down><v-subheader>Order Id</v-subheader></v-flex>
      <v-flex md3 xs12>
        <v-text-field v-model="newLink.orderId" label="Order Id"/>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-4">
      <v-flex md3 hidden-sm-and-down><v-subheader>Download count</v-subheader></v-flex>
      <v-flex md3 xs12>
        <v-text-field v-model="newLink.downloadCount" label="Download count"/>
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
      newLink: {
        email: 'some@email.com',
        orderId: '123',
        downloadCount: 5
      },
      link: '',
      resultDialog: false,
      loadingTree: true,
      treeData: undefined
    }
  },
  methods: {
    submit () {
      const linkData = {
        ...this.newLink,
        files: this.tree.checked
      }
      this.$http.post(`${config.backend_base}/links`, { command: 'CREATE_LINK', data: linkData })
        .then((res) => {
          console.log('CREATE_LINK response', res.data)
          const linkData = res.data.data
          this.link = config.backend_base + linkData.link
          this.resultDialog = true
        })
        .catch(err => {
          console.log('CREATE_LINK failed', err)
        })
    }
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
