<template>
  <v-container fluid class="text-xs-left" align-content-start justify-start>
    <v-layout row class="mb-3" align-content-start justify-start>
      <v-flex sm12 class="mt-status-panel elevation-3">
        <div v-if="pingPending" class="grey--text">
          <v-progress-circular v-if="pingPending" indeterminate :width="4" :size="24" class="ma-0" color="grey" /> Geting state...
        </div>
        <div v-else>
          <div class="green--text" v-if="serverActive">
            <v-icon color="green">mdi-power-plug</v-icon> Server active <v-btn small class="ma-0" flat icon color="teal" @click="ping"><v-icon>mdi-refresh</v-icon></v-btn>
          </div>
          <div class="red--text" v-else>
            <v-icon color="red">mdi-power-plug-off</v-icon> Server is down <v-btn class="ma-0" small flat icon color="teal" @click="ping"><v-icon>mdi-refresh</v-icon></v-btn>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-card >
          <v-card-actions class="pa-0">
            <v-btn flat :disabled="pending" @click="resetVarnish" class="ma-0 px-3">RESET VARNISH</v-btn>
            <v-btn flat :disabled="pending" @click="resetApache" class="ma-0 px-3">RESET APACHE</v-btn>
            <v-btn flat :disabled="pending" @click="cleanCache" class="ma-0 px-3">CACHE CLEAN</v-btn>
            <v-btn flat :disabled="pending" @click="getLog" class="ma-0 px-3">GET LOG</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="output = ''" class="ma-0 px-3">CLEAR OUTPUT</v-btn>
          </v-card-actions>
          <v-progress-linear height="2" color="blue lighten-3" class="pa-0 ma-0" :value="0" :indeterminate="pending"></v-progress-linear>
          <v-card-text class="mt-output">
            <pre v-html="output"></pre>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Control',
  data () {
    return {
      pingPending: true,
      serverActive: false,
      pending: false,
      output: ''
    }
  },
  mounted () {
    this.ping()
    setInterval(this.ping, 60000)
  },
  methods: {
    ping () {
      this.pingPending = true
      this.$backend.control.ping()
        .then(({ data }) => {
          this.pingPending = false
          this.serverActive = data.data === 'PONG'
          console.log('PING COMPETE', data)
        }).catch(err => {
          this.serverActive = false
          this.pingPending = false
          console.log('PING FAIL', err)
        })
    },
    resetVarnish () {
      this.pending = true
      this.$backend.control.resetVarnish()
        .then(res => {
          this.pending = false
          console.log('RESET_VARNISH COMPETE', res.data)
          if (res.data.status === 'OK') {
            this.output = '<span class="green--text">RESET_VARNISH - OK!</span>\n'
          } else {
            throw new Error(res.data.error)
          }
        }).catch(err => {
          this.pending = false
          console.log('RESET FAIL', err)
          this.output = '<span class="red--text">RESET_VARNISH FAIL</span>\n'
          this.output += `<span class="grey--text">${err}</span>`
        })
    },
    resetApache () {
      this.pending = true
      this.$backend.control.resetApache()
        .then(res => {
          this.pending = false
          console.log('RESET_APACHE COMPETE', res.data)
          if (res.data.status === 'OK') {
            this.output = '<span class="green--text">RESET_APACHE - OK!</span>\n'
          } else {
            throw new Error(res.data.error)
          }
        }).catch(err => {
          this.pending = false
          console.log('RESET FAIL', err)
          this.output = '<span class="red--text">RESET_APACHE FAIL</span>\n'
          this.output += `<span class="grey--text">${err}</span>`
        })
    },
    getLog () {
      this.pending = true
      this.$backend.control.getLog()
        .then(({ data }) => {
          this.pending = false
          console.log('GET_LOG COMPETE', data)
          if (data.status === 'OK') {
            const logs = data.data.map(it => `<span class="teal--text">${it.timestamp}</span>: ${it.message}`)
            this.output = _.reverse(logs).join('')
          } else {
            throw new Error(data.error)
          }
        }).catch(err => {
          this.pending = false
          console.log('GET_LOG FAIL', err)
          this.output = '<span class="red--text">GET_LOG FAIL</span>\n'
          this.output += `<span class="grey--text">${err}</span>`
        })
    },
    cleanCache () {
      this.pending = true
      this.$backend.control.cleanCache()
        .then(res => {
          this.pending = false
          console.log('CLEAN_CACHE COMPETE', res.data)
          if (res.data.status === 'OK') {
            this.output = '<span class="green--text">CLEAN_CACHE - OK!</span>\n'
          } else {
            throw new Error(res.data.error)
          }
        }).catch(err => {
          this.pending = false
          console.log('CLEAN_CACHE FAIL\n', err)
          this.output = '<span class="red--text">CLEAN_CACHE FAIL</span>\n'
          this.output += `<span class="grey--text">${err}</span>`
        })
    }
  }
}
</script>

<style lang="sass">
.mt-output
  background: #111
  padding: 0
  overflow: scroll
  pre
    padding: 5px
    min-height: 200px
    height: auto
    overflow: scroll
    font-size: 12px
    font-family: menlo, monaco, mono
.mt-progress
  padding: 0
  .progress-linear
    margin: 0 !important

.mt-status-panel
  background: #444
  color: white
  padding: 5px 10px
</style>
