<template>
  <ion-app>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>UNADF</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  }
});
</script>