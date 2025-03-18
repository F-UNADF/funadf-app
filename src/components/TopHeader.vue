<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-buttons slot="start" v-if="loggedIn">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-title>
        <ion-img src="/assets/logo-add.png" class="add-logo"></ion-img>
      </ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonImg } from '@ionic/vue';

export default {
  name: 'TopHeader',
  components: { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonImg },
  computed: {
    loggedIn() {
      return localStorage.getItem('token') !== null;
    }
  }
}
</script>

<style>
ion-header {
  z-index: 1000;
  /* Assure-toi qu'il est au-dessus des autres éléments */
}
</style>