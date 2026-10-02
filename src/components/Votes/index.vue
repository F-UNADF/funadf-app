<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
    <ion-refresher-content pulling-text="Tirez pour actualiser" refreshing-spinner="crescent" />
  </ion-refresher>

  <div class="app-screen">
    <h1 class="app-title">Votes</h1>

    <list-skeleton v-if="status === 'loading' && campaigns.length === 0" variant="row" :count="3" />

    <screen-state v-else-if="status === 'error' && campaigns.length === 0" kind="error" @action="reload" />

    <screen-state v-else-if="campaigns.length === 0" :icon="checkboxOutline" title="Aucun vote en cours"
      text="Quand une campagne de vote vous concernera, elle apparaîtra ici." action="Actualiser" @action="reload" />

    <div v-else class="app-stack">
      <ion-card v-for="item in campaigns" :key="item.id" class="vote-card" :class="{ 'is-open': item.state === 'opened' }">
        <div class="vote-head">
          <div class="vote-text">
            <h2 class="vote-name">{{ item.name }}</h2>
            <p class="vote-structure">{{ item.structure && item.structure.name }}</p>
          </div>
          <span class="app-pill" :class="stateOf(item).pill">{{ stateOf(item).label }}</span>
        </div>

        <div v-if="item.state === 'opened'" class="vote-action">
          <ion-button expand="block" @click="goVote(item)">
            Voter
            <ion-icon slot="end" :icon="chevronForward" aria-hidden="true" />
          </ion-button>
        </div>
        <p v-else class="vote-hint">{{ stateOf(item).hint }}</p>
      </ion-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { IonCard, IonButton, IonIcon, IonRefresher, IonRefresherContent } from "@ionic/vue";
import { checkboxOutline, chevronForward } from "ionicons/icons";
import ScreenState from "../Common/ScreenState.vue";
import ListSkeleton from "../Common/ListSkeleton.vue";
import { tapLight } from "@/utils/haptics";

const STATES = {
  opened: { label: "Ouvert", pill: "is-success", hint: "" },
  coming: { label: "À venir", pill: "", hint: "Le vote n’est pas encore ouvert." },
  closed: { label: "Clos", pill: "is-muted", hint: "Le vote est terminé." },
};

export default {
  name: "VotesIndex",
  components: { IonCard, IonButton, IonIcon, IonRefresher, IonRefresherContent, ScreenState, ListSkeleton },
  data() {
    return { status: "loading" };
  },
  computed: {
    ...mapGetters("votesStore", {
      items: "getItems",
    }),
    // Les votes ouverts d'abord
    campaigns() {
      const list = Array.isArray(this.items) ? this.items.slice() : [];
      const rank = { opened: 0, coming: 1, closed: 2 };
      return list.sort((a, b) => (rank[a.state] ?? 1) - (rank[b.state] ?? 1));
    },
  },
  methods: {
    stateOf(item) {
      return STATES[item.state] || STATES.coming;
    },
    async reload() {
      this.status = "loading";
      try {
        await this.$store.dispatch("votesStore/items");
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
    goVote(item) {
      this.$store.commit("votesStore/setItem", item);
      this.$router.push({ name: "VoteShow", params: { campaign_id: item.id } });
    },
  },
  setup() {
    return { checkboxOutline, chevronForward };
  },
  mounted() {
    if (null === localStorage.getItem("token")) {
      this.$router.push({ name: "Login", replace: true });
      return;
    }
    this.reload();
  },
};
</script>

<style scoped>
.vote-card {
  padding: 16px;
}

.vote-card.is-open {
  border-color: rgba(var(--ion-color-primary-rgb), 0.45);
}

.vote-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.vote-text {
  flex: 1;
  min-width: 0;
}

.vote-name {
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--app-text);
}

.vote-structure {
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}

.app-pill.is-muted {
  background: var(--ion-background-color-step-100);
  color: var(--app-text-muted);
}

.vote-action {
  margin-top: 14px;
}

.vote-action ion-button {
  margin: 0;
  min-height: 48px;
  --border-radius: var(--app-radius-control);
  font-weight: 600;
}

.vote-hint {
  margin: 10px 0 0;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}
</style>
