<template>
  <ion-card class="event-card">
    <figure v-if="full && event.images && event.images.length" class="cover">
      <img :src="event.images[0]" alt="" loading="lazy" />
    </figure>

    <component :is="full ? 'div' : 'router-link'" class="event-main"
      v-bind="full ? {} : { to: { name: 'EventsShow', params: { id: event.id } } }">
      <div class="date-tile" aria-hidden="true">
        <span class="tile-weekday">{{ tile.weekday }}</span>
        <span class="tile-day">{{ tile.day }}</span>
        <span class="tile-month">{{ tile.month }}</span>
      </div>

      <div class="event-text">
        <h2 class="event-title">{{ event.title }}</h2>
        <p class="event-when">{{ when }}</p>
        <p class="event-org">{{ structureName }}</p>
        <span v-if="category" class="app-pill event-category">{{ category }}</span>
      </div>
    </component>

    <div v-if="full" class="event-description app-rich-text" v-html="event.description"></div>
    <p v-else-if="summary" class="event-summary">{{ summary }}</p>

    <ion-list v-if="full && event.attachments && event.attachments.length" class="attachments" lines="inset">
      <ion-item v-for="(url, index) in event.attachments" :key="url" button :detail="false" @click="openUrl(url)">
        <ion-icon slot="start" :icon="documentTextOutline" aria-hidden="true" />
        <ion-label class="ion-text-wrap">{{ fileName(url, index) }}</ion-label>
      </ion-item>
    </ion-list>

    <div class="event-actions">
      <ion-button fill="clear" class="calendar-btn" :disabled="adding" @click="addToCalendar">
        <ion-icon slot="start" :icon="calendarOutline" aria-hidden="true" />
        Ajouter à mon calendrier
      </ion-button>
    </div>
  </ion-card>
</template>

<script>
import { IonCard, IonButton, IonIcon, IonList, IonItem, IonLabel } from "@ionic/vue";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { CapacitorCalendar } from "@ebarooni/capacitor-calendar";
import { calendarOutline, documentTextOutline } from "ionicons/icons";
import { dateTile, eventRange, plainText } from "@/utils/format";
import { success } from "@/utils/haptics";

export default {
  name: "EventCard",
  components: { IonCard, IonButton, IonIcon, IonList, IonItem, IonLabel },
  props: {
    event: { type: Object, required: true },
    full: { type: Boolean, default: false },
  },
  data() {
    return { adding: false };
  },
  computed: {
    tile() {
      return dateTile(this.event.start_at);
    },
    when() {
      const text = eventRange(this.event.start_at, this.event.end_at);
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    structureName() {
      return (this.event.structure && this.event.structure.name) || "";
    },
    // L'API renvoie la catégorie en texte ; on accepte aussi un objet { name }
    category() {
      const c = this.event.category;
      return typeof c === "string" ? c : (c && c.name) || "";
    },
    summary() {
      const text = plainText(this.event.description);
      return text.length > 140 ? text.slice(0, text.lastIndexOf(" ", 140)) + "…" : text;
    },
  },
  methods: {
    fileName(url, index) {
      try {
        const clean = url.split("?")[0];
        const name = decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1));
        return name && name.length < 60 ? name : `Pièce jointe ${index + 1}`;
      } catch (e) {
        return `Pièce jointe ${index + 1}`;
      }
    },
    openUrl(url) {
      Browser.open({ url }).catch(() => window.open(url, "_blank"));
    },
    async addToCalendar() {
      const toast = (msg, color) => this.$root.presentToast && this.$root.presentToast(msg, color);
      if (!Capacitor.isNativePlatform()) {
        toast("L’ajout au calendrier se fait depuis l’application mobile.", "medium");
        return;
      }
      this.adding = true;
      try {
        // iOS : l'accès en écriture seule suffit pour créer un événement (iOS 17+).
        // Android : le plugin lit la liste des calendriers pour trouver celui par défaut,
        // il faut donc READ_CALENDAR + WRITE_CALENDAR.
        const { result: permission } = Capacitor.getPlatform() === "ios"
          ? await CapacitorCalendar.requestWriteOnlyCalendarAccess()
          : await CapacitorCalendar.requestFullCalendarAccess();
        if (permission !== "granted") {
          toast("Autorisez l’accès au calendrier dans les réglages du téléphone.", "warning");
          return;
        }

        const start = new Date(this.event.start_at).getTime();
        const end = this.event.end_at ? new Date(this.event.end_at).getTime() : start + 3600 * 1000;
        await CapacitorCalendar.createEvent({
          title: this.event.title,
          startDate: start,
          endDate: end,
          location: this.event.location || "",
          description: plainText(this.event.description),
        });

        success();
        toast("Événement ajouté à votre calendrier", "success");
      } catch (e) {
        toast("L’événement n’a pas pu être ajouté. Réessayez.", "danger");
      } finally {
        this.adding = false;
      }
    },
  },
  setup() {
    return { calendarOutline, documentTextOutline };
  },
};
</script>

<style scoped>
.event-card {
  margin: 0;
}

.cover {
  margin: 0;
  aspect-ratio: 16 / 9;
  background: var(--app-accent-soft);
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.event-main {
  display: flex;
  gap: 14px;
  padding: 16px 16px 0;
  color: inherit;
  text-decoration: none;
}

/* Tuile de date : le repère visuel de l'agenda */
.date-tile {
  flex: 0 0 auto;
  align-self: flex-start;
  width: 56px;
  padding: 6px 0 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  background: var(--app-accent-soft);
  color: var(--app-accent-ink);
  line-height: 1.1;
}

.tile-weekday,
.tile-month {
  font-size: 0.75rem;
  font-weight: 600;
}

.tile-day {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 2px 0;
}

.event-text {
  flex: 1;
  min-width: 0;
}

.event-title {
  margin: 2px 0 4px;
  font-size: 1.0625rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--app-text);
}

.event-when,
.event-org {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--app-text-muted);
}

.event-when {
  color: var(--app-text);
}

.event-category {
  margin-top: 8px;
}

.event-summary {
  margin: 12px 16px 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--app-text);
}

.event-description {
  padding: 14px 16px 0;
}

.attachments {
  margin: 12px 0 0;
  padding: 0;
  border-top: 1px solid var(--app-border);
  background: transparent;
}

.attachments ion-item {
  --background: transparent;
}

.attachments ion-icon[slot="start"] {
  color: var(--ion-color-primary);
}

.event-actions {
  margin-top: 8px;
  padding: 4px 6px 6px;
  border-top: 1px solid var(--app-border);
}

.calendar-btn {
  min-height: 44px;
  margin: 0;
  font-weight: 600;
}
</style>
