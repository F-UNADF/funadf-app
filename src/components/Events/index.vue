<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  <ion-content>
    <ion-card v-for="event in items" :key="event.event.id">
      <img alt="Images Illustration" :src="event.images[0]" v-if="event.images.length > 0" />
      <ion-card-header>
        <ion-card-subtitle>
          <ion-chip color="primary">
            <ion-avatar>
              <img :src="getAvatar(event.structure.id)" width="20" alt="avatar" />
            </ion-avatar>
            <ion-label>{{ event.structure.name }}</ion-label>
          </ion-chip>
        </ion-card-subtitle>
        <ion-card-title>{{ event.event.title }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-icon :icon="calendar"></ion-icon>
        {{ displayDate(event.event.start_at, event.event.end_at) }}
        <br>
        <ion-icon :icon="bookmark"></ion-icon>
        {{ event.event.category.name }}
      </ion-card-content>
      <ion-card-content v-html="event.event.description"></ion-card-content>
      <ion-card-content>
        <ion-row v-if="event?.attachments">
          <ion-col v-for="(attachment, index) in event?.attachments" :key="index" size="4">
            <ion-button :href="attachment" target="_blank" size="small" expand="block">
              Pièce jointe {{ index + 1 }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-card-content>
      <ion-button size="small" shape="round" color="primary" fill="clear" @click="addToCalendar(event)">
        <ion-icon slot="start" :icon="calendarNumber"></ion-icon>
        Ajouter à mon calendrier
      </ion-button>
    </ion-card>

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
import { IonContent, IonButton, IonIcon, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonChip, IonRefresher, IonRefresherContent, IonRow, IonCol } from '@ionic/vue';
import { calendar, bookmark, calendarNumber } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { CapacitorCalendar } from 'capacitor-calendar';

export default {
  name: "EventsIndex",
  components: { IonContent, IonRow, IonCol, IonButton, IonIcon, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonChip, IonRefresher, IonRefresherContent },
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
    displayDate: function (start_at, end_at) {
      let start = new Date(start_at);
      let end = new Date(end_at);
      let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      return start.toLocaleDateString('fr-FR', options) + ' - ' + end.toLocaleDateString('fr-FR', options);
    },
    async addToCalendar(event) {
      if (Capacitor.isNativePlatform()) {
        // create calendar event on mobile
        let result;
        try {
          // the first time, the user will be prompted to grant permission
          result = await CapacitorCalendar.getAvailableCalendars();
        } catch (e) {
          this.$root.presentToast('Erreur lors de la récupération des calendriers', 'warning');
          return;
        }

        if (result?.availableCalendars.length) {
          try {
            // Création de l'événement
            await CapacitorCalendar.createEvent({
              title: event.event.title,
              startDate: new Date(event.event.start_at).getTime(),
              endDate: new Date(event.event.end_at).getTime(),
              location: event.event.location || '',
              notes: event.event.description || '',
            });

            this.$root.presentToast('Événement ajouté à votre calendrier', 'success');
          } catch (error) {
            this.$root.presentToast('Un problème est survenu', 'warning');
          }
        }
      }
    }
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

  setup() {
    return {
      calendar, bookmark, calendarNumber
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