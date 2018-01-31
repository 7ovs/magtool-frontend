<template>
  <v-container fluid fill-height @keyup.enter="login">
    <v-layout justify-center align-center>
      <v-flex xs12 sm7 md6 lg4>
        <v-card md6 class="elevation-4">
          <v-card-title>
            <v-layout justify-center align-center>
              <h2 class="subheading">MAGTOOL LOGIN</h2>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>Username</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  name="username"
                  label="Enter your username"
                  v-model="username"
                  autofocus
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>Password</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  name="password"
                  label="Enter your password"
                  v-model="password"
                  :append-icon="!showPassword ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (showPassword = !showPassword)"
                  :type="!showPassword ? 'password' : 'text'"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions class="text-xs-center">
            <v-layout justify-center align-center>
              <v-btn block flat @click="login">LOGIN</v-btn>
            </v-layout>
          </v-card-actions>
          <v-snackbar :timeout="5000" color="error" v-model="snackbar">
            {{ lastError }}
            <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
          </v-snackbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      showPassword: false,
      snackbar: false,
      lastError: ''
    }
  },
  methods: {
    login () {
      console.log(this.$session)
      console.log(Vue.session)
      this.$session.login(this.username, this.password).then(session => {
        console.log('LOGIN SUCCESS', session)
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
        this.lastError = _.capitalize(err.message)
        this.snackbar = true
      })
    }
  }
}
</script>
