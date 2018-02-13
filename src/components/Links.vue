<template>
  <v-container fluid class="text-xs-left">
    <link-dialog :link="linkDataDialog" :persistent="false" @close="linkDataDialog = null"/>
    <v-layout column>
      <v-flex xs12>
        <v-card class="elevation-1 mb-3">
          <v-toolbar flat dense card>
            <v-toolbar-items class="ml-0">
              <v-btn flat color="teal lighten-2" @click="$router.push('/links/create')"><v-icon>mdi-plus-circle-outline</v-icon>&nbsp;CREATE</v-btn>
            </v-toolbar-items>
            <!-- <v-spacer></v-spacer>
            <v-toolbar-title>Links</v-toolbar-title> -->
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search" />
          </v-toolbar>
          <!-- <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search" />
          </v-card-title> -->
          <v-card-text class="pa-0 ma-0">
            <v-data-table :search="search" :headers="headers" :items="links"
              :loading="loading" :rows-per-page-items="[20,50,100]" :pagination.sync="pagination">
              <v-progress-linear slot="progress" height="3" color="blue-grey lighten-4" :indeterminate="true"></v-progress-linear>
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="text-xs-left" width=""><a @click="linkDataDialog = props.item">{{ props.item.shortHash }}</a></td>
                  <td class="text-xs-left"><downlaod-active :link="props.item" /></td>
                  <td class="text-xs-left">{{ props.item.filesDirInline }}</td>
                  <td class="text-xs-left">{{ props.item.email }}</td>
                  <td class="text-xs-left">{{ props.item.orderId }}</td>
                  <td class="text-xs-left">{{ props.item.createdBy }}</td>
                  <td class="text-xs-left">
                    <v-tooltip top :open-delay="300" color="grey darken-4">
                      <span slot="activator">{{ props.item.createdAt.fromNow(true) }}</span>
                      <span>{{ props.item.createdAt.format('DD MMMM YYYY, HH:mm:ss') }}</span>
                    </v-tooltip>
                  </td>
                  <td class="text-xs-left">
                    <v-layout row>
                      <v-btn small @click="$router.push(`/links/edit/${props.item.hash}`)" flat icon color="teal lighten-2" class="mx-0"><v-icon>mdi-lead-pencil</v-icon></v-btn>
                      <v-btn small @click="deleteLink(props.item)" flat icon color="brown lighten-2" class="mx-0"><v-icon>mdi-delete</v-icon></v-btn>
                    </v-layout>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Link from '@/classes/link'
import DownloadActive from '@/components/ui/DownloadActive'
import LinkDialog from '@/components/ui/LinkDialog'
export default {
  name: 'Links',
  data () {
    return {
      pagination: {
        sortBy: 'createdAtRaw',
        descending: true
      },
      headers: [
        { text: 'Hash', align: 'left', sortable: true, value: 'hash', width: '7%' },
        { text: 'Active', align: 'left', sortable: false, value: 'isActive', width: '7%' },
        { text: 'Files', align: 'left', sortable: false, value: 'filesInlinepx', width: '42%' },
        { text: 'Email', align: 'left', sortable: true, value: 'email', width: '15%' },
        { text: 'Order', align: 'left', sortable: true, value: 'orderId', width: '8%' },
        { text: 'Author', align: 'left', sortable: true, value: 'createdBy', width: '8%' },
        { text: 'Created', align: 'left', sortable: true, value: 'createdAtRaw', width: '8%' },
        { text: 'Control', align: 'left', sortable: false, width: '5%' }
      ],
      search: '',
      links: [],
      loading: true,
      linkDataDialog: null
    }
  },
  mounted () {
    this.$backend.links.getLinks()
      .then((res) => {
        console.log('GET_LINKS', res.data)
        const linksData = res.data.data
        this.links = linksData.map(it => new Link(it))
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
  },
  methods: {
    deleteLink (linkData) {
      if (confirm(`DELETE LINK '${linkData.shortHash}'?`)) {
        this.loading = true
        this.$backend.links.deleteLink(linkData.id)
          .then((res) => {
            console.log('DELETE_LINK', res.data)
            const linksData = res.data.data
            this.links = linksData.map(it => new Link(it))
            this.loading = false
          }).catch(err => {
            console.log('DELETE_LINK fail', err)
          })
      }
    }
  },
  components: {
    'downlaod-active': DownloadActive,
    'link-dialog': LinkDialog
  }
}
</script>
<style lang="sass">
table.table
  table-layout: fixed

table.table tbody td:first-child,
table.table tbody td:not(:first-child),
table.table tbody th:first-child,
table.table tbody th:not(:first-child),
table.table thead td:first-child,
table.table thead td:not(:first-child),
table.table thead th:first-child,
table.table thead th:not(:first-child)
  padding: 0 4px
table.table thead th
  font-size: 14px
table.table tbody td
  font-size: 14px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis

.ellipsis
  margin: 0
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis

</style>
