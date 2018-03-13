<template>
  <v-layout row justify-center>
    <v-dialog :value="value" @input="onInput" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="amber darken-3">
          <v-btn icon @click.native="$emit('close')" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Send mail</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="send">Send</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container fluid class="pa-0 mt-2">
          <v-layout wrap>
            <v-flex xs12 class="text-xs-right">
              <v-text-field label="Email" v-model="email" single-line full-width hide-details/>
            </v-flex>
            <v-flex xs12>
              <v-divider></v-divider>
              <v-text-field label="Subject" v-model="title" single-line full-width hide-details/>
            </v-flex>
            <v-flex xs12>
              <v-divider></v-divider>
              <v-text-field label="Body" name="body" v-model="body" full-width auto-grow no-resize multi-line single-line/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'MailFormDialog',
  model: {
    prop: 'value',
    event: 'onInput'
  },
  props: {
    value: Object
  },
  data () {
    return {
      email: '',
      title: '',
      body: ''
    }
  },
  watch: {
    value (newValue) {
      console.log('newValue', newValue)
      if (newValue) {
        this.email = newValue.email
        this.title = `Order #${newValue.orderId}`
        this.body = `Hello!\nMega link = ${this.$backend.getDownloadUrl(newValue.link)}`
      }
    }
  },
  methods: {
    onInput (value) {
      if (!value) this.$emit('close')
    },
    async send () {
      if (confirm('Are you sure want to sent this email?')) {
        const result = await this.$backend.mailer.sendMail({
          email: this.email,
          title: this.title,
          body:  this.body
        })
        console.log('send mail', result.data.data)
      }
    }
  }
}
</script>
