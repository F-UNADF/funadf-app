<template>
  <ion-menu side="start" content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-menu-toggle>
          <ion-item @click="routeTo('/tabs/annuaire')">
            <ion-icon slot="start" :icon="search"></ion-icon>
            <ion-label>Annuaire</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-note color="medium" class="ion-padding-vertical ion-padding-horizontal">
        Version : {{ app_version }}
      </ion-note>
      <ion-list>
        <ion-item color="danger" @click="logout()">
          <ion-icon slot="start" :icon="logInOutline"></ion-icon>
          <ion-label>Déconnexion</ion-label>
        </ion-item>
      </ion-list>
    </ion-footer>
  </ion-menu>
</template>

<script>

import { } from "@ionic/vue";

export default {
  name: "SideMenu",
  components: {},
  methods: {
    routeTo(route) {
      this.$router.push({ path: route });
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push({ name: "Login", replace: true });
    },
  },
  data() {
    return {
      app_version: '1.2.3',
    };
  },
};
</script>