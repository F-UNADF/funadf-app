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

  </ion-app>
</template>

<script>
import { IonApp, IonHeader, IonToolbar, IonTitle, toastController, IonRouterOutlet } from '@ionic/vue';
import {mapGetters} from "vuex";

export default ({
  name: 'App',
  components: { IonApp, IonHeader, IonToolbar, IonTitle, IonRouterOutlet },
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

});
</script>
