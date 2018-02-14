<template>
  <v-dialog v-if="link" :value="show" @input="onInput"
    :persistent="persistent !== undefined ? persistent : true" max-width="420">
    <v-card>
      <v-card-text>
        <v-text-field disabled label="Download limit" :value="link.downloadsLimit"/>
        <v-text-field disabled label="Current download counter value" :value="link.downloadsCount"/>
      </v-card-text>
      <v-card-text>
        <v-text-field label="New download couner value" :value="0" @input="onInputCounter" autofocus/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" flat="flat" @click.native="$emit('submit', link, newCount)">APPLY</v-btn>
        <v-btn color="green darken-1" flat="flat" @click.native="$emit('close')">CLOSE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DownloadCounterDialog',
  props: ['link', 'persistent'],
  data ({link}) {
    return {
      show: false,
      newCount: 0
    }
  },
  watch: {
    link (linkObj) {
      if (linkObj) this.show = true
      else this.show = false
    }
  },
  methods: {
    onInputCounter (value) {
      this.newCount = +value
    },
    onInput (value) {
      if (!value) this.$emit('close')
    }
  }
}
</script>
