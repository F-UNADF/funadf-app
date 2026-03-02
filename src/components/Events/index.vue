<template>
  <ion-page>
    <ion-content class="events-content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content pulling-text="Tire pour rafraîchir" refreshing-spinner="crescent" />
      </ion-refresher>

      <div class="events-shell">
        <eventsShow v-for="event in items" :key="event.id" :event="event" />

        <div class="load-more">
          <ion-button v-if="!endOfFeed" expand="block" class="load-btn" :disabled="loading" @click="load"
            color="primary">
            <ion-spinner v-if="loading" name="crescent" class="btn-spinner" />
            <span v-else>Voir plus</span>
          </ion-button>

          <ion-item v-else lines="none" class="end-state">
            <ion-label>Il n’y a plus rien à voir.</ion-label>
          </ion-item>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script>
import { mapGetters } from 'vuex';
import {
  IonPage,
  IonContent,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import eventsShow from './show.vue';

export default {
  name: 'EventsIndex',
  components: {
    eventsShow,
    IonPage,
    IonContent,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonItem,
    IonLabel,
  },
  computed: {
    ...mapGetters('eventsStore', {
      items: 'getItems',
      // idéalement: endOfFeed vient du store
      storeEndOfFeed: 'getEndOfFeed',
    }),
    endOfFeed() {
      return this.storeEndOfFeed ?? false;
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async handleRefresh(ev) {
      try {
        // si ton store supporte un reset/refresh, fais-le
        await this.$store.dispatch('eventsStore/getItems', { reset: true });
      } finally {
        ev.detail.complete();
      }
    },
    async load() {
      if (this.loading || this.endOfFeed) return;

      this.loading = true;
      try {
        await this.$store.dispatch('eventsStore/getItems');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.events-content {
  --background: var(--ion-background-color);
}

.events-shell {
  padding: 12px 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.load-more {
  margin-top: 8px;
}

.load-btn {
  --border-radius: 16px;
  height: 44px;
}

.btn-spinner {
  width: 18px;
  height: 18px;
}

.end-state {
  --background: transparent;
  border: 1px solid var(--ion-color-border);
  border-radius: 14px;
  text-align: center;
}

.end-state ion-label {
  color: var(--ion-color-step-500);
  padding: 10px 0;
}
</style>