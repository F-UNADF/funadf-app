<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  <ion-content>
    <eventsShow v-for="event in items" :key="event.id" :event="event" />

    <ion-button expand="block" color="primary" class="ion-margin" @click="load()" :loading="this.loading"
      v-if="!this.endOfFeed">
      VOIR PLUS
    </ion-button>
    <ion-button expand="block" color="secondary" v-else disabled class="ion-margin">Il n'y a plus rien a voir
      !</ion-button>

  </ion-content>
</template>


<script>

import { mapGetters } from "vuex";
import { IonContent, IonButton, IonRefresher, IonRefresherContent } from '@ionic/vue';
import eventsShow from './show.vue';

export default {
  name: "EventsIndex",
  components: { eventsShow, IonContent, IonButton, IonRefresher, IonRefresherContent },
  computed: {
    ...mapGetters('eventsStore', {
      items: 'getItems',
    }),
  },

  methods: {
    handleRefresh: function (event) {
      this.$store.dispatch('eventsStore/getItems');
      setTimeout(() => {
        event.detail.complete();
      }, 2000);
    },
    load() {
      this.loading = true;
      this.$store.dispatch('eventsStore/getItems').then(() => {
        this.loading = false;
      });
    },
    getAvatar: function (id) {
      let base_url =
        process.env.NODE_ENV === "production"
          ? "https://app.addfrance.fr"
          : "http://localhost:3000";
      return base_url + '/logos/' + id + '.png';
    },
  },

  mounted() {
    this.load();
  },

  data() {
    return {
      loading: false,
      endOfFeed: false,
      events: [],
    };
  },
};
</script>

<style scoped>
ion-card-title {
  --color: #001521;
}

@media (prefers-color-scheme: dark) {
  ion-card-title {
    --color: #f8f9fa;
  }
}
</style>