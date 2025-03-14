<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  <ion-list>
    <nested-document v-for="item in items" :key="item.id" :item="item" @downloadDocument="downloadDocument">
    </nested-document>
  </ion-list>
</template>

<script>

import { IonList, IonRefresher, IonRefresherContent } from '@ionic/vue';
import NestedDocument from './NestedDocument.vue';
import { mapGetters } from 'vuex';

export default {
  name: "AssociationShowComponent",
  components: { IonList, NestedDocument, IonRefresher, IonRefresherContent },
  props: {},
  computed: {
    ...mapGetters('documentsStore', {
      items: 'getItems',
    }),
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
