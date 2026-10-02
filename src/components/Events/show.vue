<template>
  <!-- Détail d'un événement (/agenda/:id), ouvert depuis l'agenda ou une notification -->
  <div class="app-screen event-screen">
    <list-skeleton v-if="status === 'loading'" variant="event" :count="1" />
    <screen-state v-else-if="status === 'error'" kind="error" title="Impossible d’afficher cet événement"
      @action="loadEvent" />
    <event-card v-else-if="localEvent" :event="localEvent" :full="true" />
  </div>
</template>

<script>
import axios from "axios";
import EventCard from "./EventCard.vue";
import ScreenState from "../Common/ScreenState.vue";
import ListSkeleton from "../Common/ListSkeleton.vue";
import { BASE_URL } from "@/utils/format";

export default {
  name: "EventsShow",
  components: { EventCard, ScreenState, ListSkeleton },
  data() {
    return {
      localEvent: null,
      status: "loading",
    };
  },
  methods: {
    async loadEvent() {
      const eventId = this.$route.params.id;
      if (!eventId) return;
      // Déjà dans la liste chargée : affichage immédiat
      const known = (this.$store.getters["eventsStore/getItems"] || []).find((e) => String(e.id) === String(eventId));
      if (known) {
        this.localEvent = known;
        this.status = "ready";
        return;
      }
      this.status = "loading";
      try {
        const response = await axios.get(`${BASE_URL}/api/events/${eventId}`);
        this.localEvent = response.data.event;
        this.status = "ready";
      } catch (e) {
        this.status = "error";
      }
    },
  },
  mounted() {
    this.loadEvent();
  },
  watch: {
    "$route.params.id"(id) {
      if (id) this.loadEvent();
    },
  },
};
</script>

<style scoped>
.event-screen {
  padding-top: var(--app-gutter);
}
</style>
