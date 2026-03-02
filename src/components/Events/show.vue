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
  <ion-card v-else class="event-card">
    <div class="cover" v-if="localEvent.images?.length">
      <img :src="localEvent.images[0]" alt="Illustration" />
      <div class="cover-gradient"></div>
    </div>

    <ion-card-header class="event-header">
      <ion-chip class="structure-chip" color="primary">
        <ion-avatar>
          <img :src="getAvatar(localEvent.structure?.id)" alt="avatar" />
        </ion-avatar>
        <ion-label>{{ localEvent.structure?.name }}</ion-label>
      </ion-chip>

      <ion-card-title class="event-title">{{ localEvent.title }}</ion-card-title>

      <div class="event-meta">
        <div class="meta-line">
          <ion-icon :icon="calendar" class="meta-icon" />
          <span>{{ displayDate(localEvent.start_at, localEvent.end_at) }}</span>
        </div>

        <div class="meta-line">
          <ion-icon :icon="bookmark" class="meta-icon" />
          <span>{{ localEvent.category?.name }}</span>
        </div>
      </div>
    </ion-card-header>

    <ion-card-content class="event-content" v-html="localEvent.description"></ion-card-content>

    <ion-card-content v-if="localEvent.attachments?.length">
      <ion-row>
        <ion-col v-for="(attachment, index) in localEvent.attachments" :key="index" size="6">
          <ion-button :href="attachment" target="_blank" size="small" expand="block" fill="outline">
            Pièce {{ index + 1 }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-card-content>

    <ion-button class="event-cta" size="small" shape="round" fill="clear" @click="addToCalendar(localEvent)">
      <ion-icon slot="start" :icon="calendarNumber" />
      Ajouter à mon calendrier
    </ion-button>
  </ion-card>
</template>

<script>
import { IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonAvatar, IonLabel, IonRow, IonCol, IonButton, IonSkeletonText, IonList, IonListHeader, IonItem, IonThumbnail } from '@ionic/vue';
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
      if (!Capacitor.isNativePlatform()) return;

      try {
        const result = await CapacitorCalendar.getAvailableCalendars();
        if (!result?.availableCalendars?.length) return;

        await CapacitorCalendar.createEvent({
          title: event.title,
          startDate: new Date(event.start_at).getTime(),
          endDate: new Date(event.end_at).getTime(),
          location: event.location || '',
          notes: event.description || '',
        });

        this.$root.presentToast('Événement ajouté à votre calendrier', 'success');
      } catch (e) {
        this.$root.presentToast('Un problème est survenu', 'warning');
      }
    },
    displayDate(startStr, endStr) {
      const format = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} à ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      };

      return `Du ${format(startStr)} au ${format(endStr)}`;
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

<style scoped>
.event-card {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--ion-color-border);
  box-shadow: none;
  background: var(--ion-card-background);
}

.cover {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 30%, rgba(0, 0, 0, 0.35));
}

.event-header {
  padding-bottom: 8px;
}

.structure-chip {
  --border-radius: 999px;
}

.event-title {
  margin-top: 8px;
  letter-spacing: -0.2px;
}

.event-meta {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--ion-color-step-500);
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-icon {
  font-size: 16px;
  color: var(--ion-color-primary);
  opacity: 0.9;
}

.event-content {
  padding-top: 0;
  color: var(--ion-text-color);
}

.event-cta {
  margin: 0 8px 10px;
  align-self: flex-start;
}
</style>