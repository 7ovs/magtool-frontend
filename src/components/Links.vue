<template>
  <v-container fluid class="text-xs-left">
    <v-layout row class="mb-4" align-content-start justify-start>
      <v-btn @click="$router.push('/links/create')">Create link</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Links'
}
</script>
