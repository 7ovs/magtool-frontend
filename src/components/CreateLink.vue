<template>
  <v-container fluid class="text-xs-left">
    <link-dialog title="Link successfully created!" :link="linkData" @close="$router.push('/links')"/>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-layout row class="mb-4">
        <v-flex md3 hidden-sm-and-down><v-subheader>Email</v-subheader></v-flex>
        <v-flex md5 xs12>
          <v-text-field v-model="newLink.email" :rules="emailRules" label="Email"/>
        </v-flex>
      </v-layout>
      <v-layout row class="mb-4">
        <v-flex md3 hidden-sm-and-down><v-subheader>Order Id</v-subheader></v-flex>
        <v-flex md3 xs12>
          <v-text-field v-model="newLink.orderId" :rules="orderIdRules" label="Order Id"/>
        </v-flex>
      </v-layout>
      <v-layout row class="mb-4">
        <v-flex md3 hidden-sm-and-down><v-subheader>Download count*</v-subheader></v-flex>
        <v-flex md3 xs12>
          <v-text-field required :rules="downloadLimitRule" v-model="newLink.downloadsLimit" label="Download count"/>
        </v-flex>
      </v-layout>
      <v-layout row class="mb-4">
        <v-flex md3 hidden-sm-and-down><v-subheader>Files*</v-subheader></v-flex>
        <v-flex md7 xs12>
          <div class="files-tree">
            <ul v-if="!loadingTree">
              <node v-for="node in tree.children" :key="node.path" :node="node"/>
            </ul>
            <v-progress-linear v-else height="2" color="blue-grey lighten-4" :indeterminate="true"></v-progress-linear>
          </div>
          <div v-if="!loadingTree && showError && tree.checked.length === 0" style="color: #ff5252; font-size: 12px; margin-top: 5px">
            At least one file should be selected
          </div>
        </v-flex>
      </v-layout>
      <v-layout row justify-end class="mt-5">
        <v-flex md7 xs12>
          <v-btn color="primary" @click="submit" class="ma-3">ADD</v-btn>
          <v-btn @click="$router.push('/links')" class="ma-3">CANCEL</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import FilesTreeNode from '@/components/ui/FilesTreeNode'
import LinkDialog from '@/components/ui/LinkDialog'
import Node from '@/classes/files-tree'
export default {
  name: 'CreateLink',
  data () {
    return {
      newLink: {
        email: '', // 'some@email.com',
        orderId: '', // '123',
        downloadsLimit: 5
      },
      valid: true,
      showError: false,
      orderIdRules: [
        v => v === '' || /^[0-9-_]+$/.test(v) || 'Order id must be valid'
      ],
      emailRules: [
        // v => !!v || 'E-mail is required',
        v => v === '' || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      downloadLimitRule: [
        v => !!v || 'Downloads limit is required',
        v => /^\d+$/.test(v) || 'Must be a numbner'
      ],
      linkData: null,
      resultDialog: false,
      loadingTree: true,
      treeData: undefined
    }
  },
  methods: {
    submit () {
      this.showError = true
      console.log(this.$refs.form.validate(), this.tree.checked.length > 0)
      if (this.$refs.form.validate() && this.tree.checked.length > 0) {
        const linkData = {
          ...this.newLink,
          files: this.tree.checked,
          created_by: this.$session.payload.username
        }
        this.$backend.links.createLink(linkData)
          .then((res) => {
            console.log('CREATE_LINK response', res.data)
            const linkData = res.data.data
            this.linkData = linkData
            this.resultDialog = true
          })
          .catch(err => {
            console.log('CREATE_LINK failed', err)
          })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  },
  mounted () {
    console.log(this.$route)
    if (this.$route.name === 'create-link-duplicate') {
      if (this.$route.params.link && this.$route.params.link.id) this.dupLink = this.$route.params.link
      else this.$router.push('/links/create')
    }
    if (this.dupLink) {
      this.newLink.email = this.dupLink.email
      this.newLink.orderId = this.dupLink.orderId
      this.newLink.downloadsLimit = this.dupLink.downloadsLimit
    }
    this.$backend.links.getFilesList()
      .then((res) => {
        this.loadingTree = false
        this.treeData = res.data.data
        const contextId = `ft-${Date.now().toString(36)}`
        this.$store.commit('CREATE_CONTEXT', contextId)
        this.tree = Node.createNode(contextId, { name: '', children: this.treeData })
        if (this.dupLink) {
          this.dupLink.files.forEach(file => {
            const node = this.tree.getNodeByPath(file.split('/'))
            if (node) node.check()
          })
        }
        console.log(res.data)
      }).catch(err => {
        console.log('GET_FILES_LIST failed', err)
      })
  },
  components: {
    node: FilesTreeNode,
    'link-dialog': LinkDialog
  }
}
</script>

<style lang="sass">
.files-tree
  border: 1px solid #aaa
  padding: 20px 10px
  background: rgb(64, 64, 64)
</style>
