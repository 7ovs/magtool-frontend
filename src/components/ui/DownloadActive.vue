<template>
  <span class="download-active">
    <v-icon color="green" v-if="link.isActive">mdi-arrow-down-bold-circle-outline</v-icon>
    <v-icon color="red" v-else>mdi-arrow-down-bold-hexagon-outline</v-icon>
    <span class="count">{{ link.downloadRemains }}</span>
  </span>
</template>

<script>
export default {
  name: 'DownloadActive',
  props: ['link']
}
</script>

<style lang="sass" scoped>
.count
  cursor: default
  font-weight: bolder
  line-height: 24px
</style>
