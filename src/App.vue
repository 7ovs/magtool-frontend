<template>
  <v-app id="app" dark>
    <router-view/>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.regenerateSession()
    setInterval(this.regenerateSession, this.$store.state.config.regenerateInterval)
  },
  methods: {
    regenerateSession () {
      if (!this.$session.isValid) return
      this.$session.regenerate().then(session => {
        console.log('regenerate complite', session.token)
      }).catch(err => {
        this.$session.logout()
        this.$router.push('/login')
        console.log('regenerate failed', err)
      })
    }
  }
}
</script>

<style lang="sass">
body, html
  height: 100%
  background: rgb(48, 48, 48)

#app
  font-family: 'Roboto', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  height: 100%

</style>
