<template>
  <ion-list v-if="this.localEvent.id === null">
    <ion-list-header>
      <ion-skeleton-text :animated="true" style="width: 80px"></ion-skeleton-text>
    </ion-list-header>
    <ion-item>
      <ion-thumbnail slot="start">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
  <ion-card v-else>
    <img alt="Images Illustration" :src="this.localEvent.images[0]" v-if="this.localEvent.images.length > 0" />
    <ion-card-header>
      <ion-card-subtitle>
        <ion-chip color="primary">
          <ion-avatar>
            <img :src="getAvatar(this.localEvent.structure.id)" width="20" alt="avatar" />
          </ion-avatar>
          <ion-label>{{ this.localEvent.structure.name }}</ion-label>
        </ion-chip>
      </ion-card-subtitle>
      <ion-card-title>{{ this.localEvent.title }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-icon :icon="calendar"></ion-icon>
      {{ displayDate(this.localEvent.start_at, this.localEvent.end_at) }}
      <br>
      <ion-icon :icon="bookmark"></ion-icon>
      {{ this.localEvent.category.name }}
    </ion-card-content>
    <ion-card-content v-html="this.localEvent.description"></ion-card-content>
    <ion-card-content>
      <ion-row v-if="this.localEvent?.attachments">
        <ion-col v-for="(attachment, index) in this.localEvent?.attachments" :key="index" size="6">
          <ion-button :href="attachment" target="_blank" size="small" expand="block">
            Pièce jointe {{ index + 1 }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-card-content>
    <ion-button size="small" shape="round" color="primary" fill="clear" @click="addToCalendar(this.localEvent)">
      <ion-icon slot="start" :icon="calendarNumber"></ion-icon>
      Ajouter à mon calendrier
    </ion-button>
  </ion-card>
</template>

<script>
import { IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonAvatar, IonLabel, IonRow, IonCol, IonButton, IonSkeletonText, IonList, IonListHeader, IonItem, IonThumbnail } from '@ionic/vue';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { CapacitorCalendar } from 'capacitor-calendar';
import { calendar, bookmark, calendarNumber } from 'ionicons/icons';

export default {
  name: "EventsShow",
  components: {
    IonIcon,
    IonList,
    IonListHeader,
    IonItem,
    IonThumbnail,
    IonSkeletonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonAvatar,
    IonLabel,
    IonRow,
    IonCol,
    IonButton
  },
  props: {
    event: {
      type: Object,
      default: () => ({})
    },
  },
  methods: {
    getAvatar: function (id) {
      let base_url =
        process.env.NODE_ENV === "production"
          ? "https://app.addfrance.fr"
          : "http://localhost:3000";
      return base_url + '/logos/' + id + '.png' + '?cache=' + new Date().getTime();
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
    },
    displayDate() {
      const format = (dateStr) => {
        const date = new Date(dateStr)
        const pad = (n) => n.toString().padStart(2, '0')
        const jj = pad(date.getDate())
        const mm = pad(date.getMonth() + 1)
        const aaaa = date.getFullYear()
        const hh = pad(date.getHours())
        const min = pad(date.getMinutes())
        return `${jj}/${mm}/${aaaa} à ${hh}:${min}`
      }

      return `Du ${format(this.localEvent.start_at)} au ${format(this.localEvent.end_at)}`
    },
    async loadEvent() {
      this.localEvent = {
        id: null,
        title: '',
        content: '',
        images: [],
        attachments: [],
        structure_id: null,
        structure: {
          name: ''
        },
      };
      // Si post props est vide, on recupere le paramètre ID de l'URL
      if (!this.event || Object.keys(this.event).length === 0) {
        const eventId = this.$route.params.id;
        if (eventId) {
          let base_url =
            process.env.NODE_ENV === "production"
              ? "https://app.addfrance.fr"
              : "http://localhost:3000";
          const response = await axios.get(`${base_url}/api/events/${eventId}`);
          this.localEvent = response.data.event;
        }
      } else {
        this.localEvent = this.event;
      }
    }
  },
  async mounted() {
    // Appel de la méthode pour charger le post
    await this.loadEvent();
  },
  watch: {
    '$route.params.id'() {
      this.loadEvent(); // Re-fetch ou autre
    }
  },
  setup() {
    return { calendar, bookmark, calendarNumber };
  },
  data() {
    return {
      localEvent: {
        id: null,
        title: '',
        content: '',
        images: [],
        attachments: [],
        structure_id: null,
        structure: {
          name: ''
        },
      },
    };
  },
};
</script>