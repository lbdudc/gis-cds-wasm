<template>
  <v-container>
    <v-progress-linear
      color="light-blue"
      height="10"
      indeterminate
      striped
    ></v-progress-linear>
    <h3>{{ $t("waitingServer") }}</h3>
  </v-container>
</template>

<script></script>

<style scoped>
h3 {
  text-align: center;
}
</style>
