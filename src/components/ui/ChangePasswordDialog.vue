<template>
  <v-dialog :value="value" @input="onInput" max-width="480">
    <v-card>
      <v-card-title>
        <h3>Change Password</h3>
      </v-card-title>
      <v-card-text v-if="statusFail">
        <v-alert type="error" :value="statusFail">
          {{ statusFail }}
        </v-alert>
      </v-card-text>
      <v-card-text>
        <v-text-field
              name="currentPassword"
              label="Current password"
              v-model="currentPassword"
              :append-icon="!showPassword ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (showPassword = !showPassword)"
              :type="!showPassword ? 'password' : 'text'"
              required
            ></v-text-field>
        <v-text-field
              name="newPassword"
              label="New password"
              v-model="newPassword"
              :append-icon="!showPassword ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (showPassword = !showPassword)"
              :type="!showPassword ? 'password' : 'text'"
              required
            ></v-text-field>
        <v-text-field
              name="newPasswordVerify"
              label="Verify Password"
              v-model="newPasswordVerify"
              :append-icon="!showPassword ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (showPassword = !showPassword)"
              :type="!showPassword ? 'password' : 'text'"
              :error-messages="newPasswordVerifyError"
              @blur="newPasswordVerifyError = newPassword && newPassword !== newPasswordVerify ? 'Password didn’t match' : undefined"
              required
            ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="yellow" @click.native="submit"
          :disabled="!currentPassword || !newPassword || newPassword !== newPasswordVerify">CHANGE</v-btn>
        <v-btn flat @click="$emit('close')">CANCEL</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar top :timeout="2000" color="success" v-model="snackbar">
      Changed!
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-dialog>
</template>

<script>
export default {
  name: 'ChangePasswordDialog',
  model: {
    prop: 'value',
    event: 'onInput'
  },
  props: {
    value: Boolean
  },
  data () {
    return {
      snackbar: false,
      statusFail: '',
      showPassword: false,
      currentPassword: '',
      newPassword: '',
      newPasswordVerify: '',
      newPasswordVerifyError: undefined
    }
  },
  watch: {
    value (val) {
      if (val) this.reset()
    }
  },
  methods: {
    submit () {
      this.$backend.profile.changePassword(this.currentPassword, this.newPassword)
        .then(res => {
          console.log('CHANGE_PASSWORD', res.data)
          if (res.data.status === 'OK') this.snackbar = true
          else throw new Error(res.data.error)
        })
        .catch(error => {
          console.log('CHANGE_PASSWORD FAIL', error)
          this.statusFail = error.message
        })
    },
    reset () {
      this.showPassword = false
      this.currentPassword = ''
      this.newPassword = ''
      this.newPasswordVerify = ''
      this.newPasswordVerifyError = undefined
    },
    onInput (value) {
      if (!value) this.$emit('close')
    }
  }
}
</script>
