<template>
  <v-app-bar color="primary" :elevation="2">
    <v-app-bar-nav-icon v-if="hasHistory" @click="goBack" />
    <v-toolbar-title>
      <img src="/assets/logo-add.png" alt="logo" class="logo" />
    </v-toolbar-title>
    <v-spacer />
    <v-btn icon v-if="userIsLoggedIn" @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default ({
  name: 'TopBar',
  
  components: {},
  data() { },
});
</script>

<style scoped>
.logo {
  height: 50px;
}
</style>
