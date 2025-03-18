<template>
  <ion-page>
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-list>
        <nested-document v-for="item in safeItems" :key="item.id" :item="item" @downloadDocument="downloadDocument">
        </nested-document>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>

import { IonList, IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue';
import NestedDocument from './NestedDocument.vue';
import { mapGetters } from 'vuex';

export default {
  name: "DocumentsIndex",
  components: { IonList, IonPage, IonContent, NestedDocument, IonRefresher, IonRefresherContent },
  props: {},
  computed: {
    ...mapGetters('documentsStore', {
      items: 'getItems',
    }),
    safeItems() {
      return this.items || []; // Évite d'avoir undefined
    }
  },
  methods: {
    handleRefresh(event) {
      this.$store.dispatch('documentsStore/getItems');
      setTimeout(() => {
        event.detail.complete();
      }, 2000);
    },
    downloadDocument(activeItems) {
      let base_url =
        process.env.NODE_ENV === "production"
          ? "https://add-fnadf.fr"
          : "http://app.localhost:3000";
      if (activeItems?.href) {
        window.open(base_url + activeItems.href, "_blank"); // Ouvrir le fichier
      }
    },
  },
  beforeCreate: function () {
    if (null === localStorage.getItem('token')) {
      this.$router.push({ name: 'Login', replace: true });
    }
    this.$store.dispatch('documentsStore/getItems');
  },
}

</script>

<style scoped>
.text-muted {
  color: gray;
  font-size: 0.8em;
}
</style>
