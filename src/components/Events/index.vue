<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
    <ion-refresher-content pulling-text="Tirez pour actualiser" refreshing-spinner="crescent" />
  </ion-refresher>

  <div class="app-screen">
    <h1 class="app-title">Agenda</h1>

    <list-skeleton v-if="status === 'loading' && items.length === 0" variant="event" :count="3" />

    <screen-state v-else-if="status === 'error' && items.length === 0" kind="error" @action="reload" />

    <screen-state v-else-if="items.length === 0" :icon="calendarOutline" title="Aucun événement à venir"
      text="Les rencontres, conventions et formations qui vous concernent apparaîtront ici." action="Actualiser"
      @action="reload" />

    <template v-else>
      <section v-for="group in groups" :key="group.key" class="month">
        <h2 class="app-section-title month-title">{{ group.label }}</h2>
        <div class="app-stack">
          <event-card v-for="event in group.events" :key="event.id" :event="event" />
        </div>
      </section>
    </template>

    <ion-infinite-scroll :disabled="items.length === 0 || endOfFeed || status === 'error'" @ionInfinite="loadMore">
      <ion-infinite-scroll-content loading-spinner="crescent" />
    </ion-infinite-scroll>

    <div v-if="items.length > 0 && status === 'error'" class="list-end">
      <ion-button fill="clear" @click="loadMore()">Charger la suite</ion-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";
import { calendarOutline } from "ionicons/icons";
import EventCard from "./EventCard.vue";
import ScreenState from "../Common/ScreenState.vue";
import ListSkeleton from "../Common/ListSkeleton.vue";
import { tapLight } from "@/utils/haptics";

export default {
  name: "EventsIndex",
  components: {
    EventCard,
    ScreenState,
    ListSkeleton,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  computed: {
    ...mapGetters("eventsStore", {
      storeItems: "getItems",
      endOfFeed: "getEndOfFeed",
    }),
    items() {
      return Array.isArray(this.storeItems) ? this.storeItems : [];
    },
    // Regroupement par mois : « Octobre 2026 »
    groups() {
      const groups = [];
      this.items.forEach((event) => {
        const d = new Date(event.start_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        let group = groups.find((g) => g.key === key);
        if (!group) {
          const label = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
          group = { key, label: label.charAt(0).toUpperCase() + label.slice(1), events: [] };
          groups.push(group);
        }
        group.events.push(event);
      });
      return groups;
    },
  },
  data() {
    return {
      status: "loading",
    };
  },
  methods: {
    async reload() {
      this.status = "loading";
      try {
        await this.$store.dispatch("eventsStore/getItems");
        this.status = "ready";
      } catch (e) {
        this.status = "error";
      }
    },
    async handleRefresh(ev) {
      await this.reload();
      ev.target.complete();
      if (this.status === "ready") tapLight();
    },
    async loadMore(ev) {
      try {
        await this.$store.dispatch("eventsStore/loadMore");
        this.status = "ready";
      } catch (e) {
        this.status = "error";
      } finally {
        if (ev && ev.target) ev.target.complete();
      }
    },
  },
  setup() {
    return { calendarOutline };
  },
  mounted() {
    if (localStorage.getItem("token") === null) {
      this.$router.push({ name: "Login", replace: true });
      return;
    }
    this.reload();
  },
};
</script>

<style scoped>
.month:first-of-type .month-title {
  margin-top: 0;
}

.list-end {
  margin-top: 20px;
  text-align: center;
}
</style>
