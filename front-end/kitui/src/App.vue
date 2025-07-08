<template>
  <div id="app">
    <router-view /> <!-- Vue qui changera en fonction de la route active -->
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
};
</script>

<style>
/* Styles globaux de l'application */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>