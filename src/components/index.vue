<template>
  <v-container fluid>
    <change-password-dialog v-model="changePassword" @close="changePassword = false"/>
    <v-navigation-drawer clipped fixed v-model="drawer" app>
      <v-list dense>
        <v-list-tile @click="$router.push(`/`)">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>CONTROL</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="$router.push(`/links`)">
          <v-list-tile-action>
            <v-icon>link</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>LINKS</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>MAGTOOL</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu transition="slide-y-transition" bottom offset-y>
          <v-btn flat slot="activator">USER: {{ $session.payload.username }} <v-icon small>mdi-chevron-down</v-icon> </v-btn>
          <v-list>
            <!-- <v-list-tile disabled @click="$router.push('/')">
              <v-list-tile-title>Progile</v-list-tile-title>
            </v-list-tile> -->
            <v-list-tile @click="changePassword = true">
              <v-list-tile-title>Change Password</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn flat @click="logout">LOGOUT</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer app fixed>
      <span>&copy; Свято-Елисаветинский монастырь, 2018</span>
    </v-footer>
  </v-container>
</template>

<script>
import ChangePasswordDialog from '@/components/ui/ChangePasswordDialog'
export default {
  name: 'index',
  data () {
    return {
      changePassword: false,
      drawer: false,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    logout () {
      this.$session.logout()
      this.$router.push('/login')
    }
  },
  components: {
    'change-password-dialog': ChangePasswordDialog
  }
}
</script>

<style lang="sass">

</style>
