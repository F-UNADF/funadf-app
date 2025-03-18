<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="primary" slot="bottom">
        <ion-tab-button tab="profil" href="/tabs/user">
          <ion-icon :icon="personOutline"></ion-icon>
          <ion-label>Profil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="documents" href="/tabs/documents">
          <ion-icon :icon="folderOpenOutline"></ion-icon>
          <ion-label>Documents</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="feed" href="/tabs/feed">
          <ion-icon :icon="newspaperOutline"></ion-icon>
          <ion-label>Actualités</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="votes" href="/tabs/votes">
          <ion-icon :icon="thumbsUpOutline"></ion-icon>
          <ion-label>Votes</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet, IonPage, IonIcon } from '@ionic/vue';
import { folderOpenOutline, newspaperOutline, personOutline, thumbsUpOutline } from 'ionicons/icons';

export default {
  name: 'BottomMenu',
  components: { IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet, IonPage, IonIcon },
  data: function () {
    return {
      personOutline,
      folderOpenOutline,
      newspaperOutline,
      thumbsUpOutline
    }
  }
}
</script>