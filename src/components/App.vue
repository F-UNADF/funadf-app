<template>
  <ion-app>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>UNADF</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-router-outlet />
    </ion-content>

    <!-- Tab bar -->
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button ref="profil" tab="profil" href="/user">
          <ion-icon name="person" aria-hidden="true"></ion-icon>
          <ion-label>Mon profil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="contact" ref="contact" href="/carte">
          <ion-icon name="contact" aria-hidden="true"></ion-icon>
          <ion-label>Ma carte pastorale</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="votes" ref="votes" href="/votes">
          <ion-icon name="checkbox" aria-hidden="true"></ion-icon>
          <ion-label>Mes votes</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script>

import { IonTabBar, IonTabButton, IonApp, IonHeader, IonToolbar, IonTitle, toastController, IonRouterOutlet } from '@ionic/vue';
import { mapGetters } from "vuex";
import sessionStore from '../store/modules/sessionStore'

export default ({
  name: 'App',
  components: { IonTabBar, IonTabButton, IonApp, IonHeader, IonToolbar, IonTitle, IonRouterOutlet },
  computed: {
    ...mapGetters('sessionStore', {
      user: 'getUser',
    }),
  },

  methods: {
    async presentToast(message) {
      const toast = await toastController.create({
        message: message,
        duration: 3000,
        cssClass: 'custom-toast',
        color: 'danger',
        buttons: [
          {
            text: 'x',
            role: 'cancel'
          }
        ],
      });

      await toast.present();
    },
  },

  data: function () {
    return {
      messageToast: "Test Message",
      showToast: false,
    }
  },
  mounted: function () {
    if (!this.$store.hasModule('sessionStore')) {
      this.$store.registerModule('sessionStore', sessionStore);
    }
  }

});
</script>
