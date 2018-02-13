<template>
  <v-container fluid class="text-xs-left">
    <v-layout row class="mb-4" align-content-start justify-start>
      <v-flex md4><v-subheader>Проверка доступности сервера</v-subheader></v-flex>
      <v-flex md1><v-progress-circular v-if="pingPending" indeterminate :width="7" color="red darken-4"></v-progress-circular></v-flex>
      <v-flex md2><v-btn color="red darken-4" block @click="ping">PING</v-btn></v-flex>
    </v-layout>
    <v-layout row class="mb-4">
      <v-flex md4><v-subheader>Отчиска кэша magento и перезапуск кэш-сервера varnish</v-subheader></v-flex>
      <v-flex md1><v-progress-circular v-if="cleanCachePending" indeterminate :width="7" color="red darken-4"></v-progress-circular></v-flex>
      <v-flex md2><v-btn color="red darken-4" block @click="cleanCache">CLEAN CACHE</v-btn></v-flex>
    </v-layout>
    <v-layout row class="mb-4">
      <v-flex md4><v-subheader>Получить лог сервера magtool</v-subheader></v-flex>
      <v-flex md1><v-progress-circular v-if="getLogPending" indeterminate :width="7" color="red darken-4"></v-progress-circular></v-flex>
      <v-flex md2><v-btn color="red darken-4" block @click="getLog">GET LOG</v-btn></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Control',
  data () {
    return {
      pingPending: false,
      cleanCachePending: false,
      getLogPending: false
    }
  },
  methods: {
    ping () {
      this.pingPending = true
      this.$backend.control.ping()
        .then(({ data }) => {
          this.pingPending = false
          console.log('PING COMPETE', data)
        }).catch(err => {
          this.pingPending = false
          console.log('PING FAIL', err)
        })
    },
    getLog () {
      this.getLogPending = true
      this.$backend.control.getLog()
        .then(({ data }) => {
          this.getLogPending = false
          console.log('GET_LOG COMPETE', data)
        }).catch(err => {
          this.getLogPending = false
          console.log('GET_LOG FAIL', err)
        })
    },
    cleanCache () {
      this.cleanCachePending = true
      this.$backend.control.cleanCache()
        .then(({ data }) => {
          this.cleanCachePending = false
          console.log('CLEAN_CACHE COMPETE', data)
        }).catch(err => {
          this.cleanCachePending = false
          console.log('CLEAN_CACHE FAIL', err)
        })
    }
  }
}
</script>
