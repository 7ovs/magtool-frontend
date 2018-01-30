<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>{{ this.$session.iat }}</p>
    <p>{{ this.$session.payload.username }}</p>
    <v-btn @click="logout">LOGOUT</v-btn>
    <v-btn @click="ping">PING</v-btn>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    logout () {
      this.$session.logout()
      this.$router.push('/login')
    },
    ping () {
      this.$http.post('http://localhost:3000/command', { command: 'PING' }).then(({data}) => {
        if (data.status === 'OK') {
          this.msg = data.data
        } else if (data.error === 'jwt expired') {
          this.$session.logout()
          this.$router.push('/login')
        }
        console.log('RESPONSE: ', data)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="sass">

</style>
