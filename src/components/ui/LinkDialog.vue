<template>
  <v-dialog v-if="link" :value="show" @input="onInput"
    :persistent="persistent !== undefined ? persistent : true" max-width="640">
    <v-card>
      <v-card-title v-if="title" class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-snackbar top :timeout="2000" color="success" v-model="clipboardSuccess">
          Copied!
          <v-btn dark flat @click.native="clipboardSuccess = false">Close</v-btn>
        </v-snackbar>
        <v-snackbar top :timeout="3000" color="error" v-model="clipboardFail">
          Copy fail... :(
          <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-text-field :value="$backend.getDownloadUrl(link.link)" readonly/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <v-btn color="light-blue darken-2" flat="flat" @click.native="download" slot="activator">Download (safe)</v-btn>
          <span>Download without increment downloads counter</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn v-clipboard="$backend.getDownloadUrl(link.link)" @success="handleSuccess" @error="handleError"
            color="light-blue darken-2" flat="flat" slot="activator">Copy link</v-btn>
          <span>Copy link to clipboard</span>
        </v-tooltip>
        <v-btn color="green darken-1" flat="flat" @click.native="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LinkDialog',
  props: ['title', 'link', 'persistent'],
  data () {
    return {
      show: false,
      clipboardSuccess: false,
      clipboardFail: false
    }
  },
  watch: {
    link (linkObj) {
      if (linkObj) this.show = true
      else this.show = false
    }
  },
  methods: {
    download () {
      window.open(this.$backend.getSafeDownloadUrl(this.link.link, this.$session.token))
    },
    handleSuccess (e) {
      this.clipboardSuccess = true
    },
    handleError (e) {
      this.clipboardFail = true
      console.log(e)
    },
    onInput (value) {
      if (!value) this.$emit('close')
    }
  }
}
</script>
