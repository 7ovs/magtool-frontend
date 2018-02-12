<template>
  <v-dialog v-if="link" :value="show" @input="onInput"
    :persistent="persistent !== undefined ? persistent : true" max-width="640">
    <v-card>
      <v-card-title v-if="title" class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-text-field :value="url" readonly/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <v-btn color="light-blue darken-2" flat="flat" @click.native="download" slot="activator">Download (safe)</v-btn>
          <span>Download without increment downloads counter</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn color="light-blue darken-2" flat="flat" @click.native="cpoy" slot="activator">Copy link</v-btn>
          <span>Copy link to clippboard</span>
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
      show: false
    }
  },
  watch: {
    link (linkObj) {
      if (linkObj) this.show = true
      else this.show = false
    }
  },
  computed: {
    url () {
      return `http://localhost:5000${this.link.link}`
    },
    safeUrl () {
      return `http://localhost:5000${this.link.link}?token=${this.$session.token}`
    }
  },
  methods: {
    copy () {},
    download () {
      window.open(this.safeUrl)
    },
    onInput (value) {
      if (!value) this.$emit('close')
    }
  }
}
</script>
