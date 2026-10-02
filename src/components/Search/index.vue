<template>
  <div class="app-screen">
    <h1 class="app-title">Annuaire</h1>

    <ion-searchbar v-model="search" class="directory-search" placeholder="Nom, ville ou code postal" :debounce="400"
      inputmode="search" enterkeyhint="search" autocapitalize="off" />

    <screen-state v-if="query.length < 3" :icon="peopleOutline" title="Trouver un pasteur ou une église"
      text="Saisissez au moins trois lettres d’un nom, d’une ville ou d’un code postal." />

    <list-skeleton v-else-if="loading" variant="row" :count="5" />

    <screen-state v-else-if="failed" kind="error" @action="searchItems" />

    <screen-state v-else-if="results.length === 0" :icon="searchOutline" title="Aucun résultat"
      :text="`Rien ne correspond à « ${query} ». Essayez un autre nom, une ville ou un code postal.`" />

    <template v-else>
      <p class="result-count">{{ results.length }} résultat{{ results.length > 1 ? 's' : '' }}</p>
      <ion-list class="app-inset-list">
        <ion-item v-for="result in results" :key="`${result.model_type}-${result.id}`" button detail
          @click="goToResult(result)">
          <app-avatar slot="start" :src="result.photo_url" :name="result.name" :size="40"
            :square="result.model_type !== 'users'" />
          <ion-label class="ion-text-wrap">
            <span class="result-name">{{ result.name }}</span>
            <p>{{ subtitle(result) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </template>
  </div>
</template>

<script>
import { IonSearchbar, IonList, IonItem, IonLabel } from "@ionic/vue";
import { peopleOutline, searchOutline } from "ionicons/icons";
import axios from "axios";
import AppAvatar from "../Common/AppAvatar.vue";
import ScreenState from "../Common/ScreenState.vue";
import ListSkeleton from "../Common/ListSkeleton.vue";
import { BASE_URL } from "@/utils/format";

const TYPES = { users: "Pasteur", churches: "Église", associations: "Association" };

export default {
  name: "SearchIndex",
  components: { IonSearchbar, IonList, IonItem, IonLabel, AppAvatar, ScreenState, ListSkeleton },
  data() {
    return {
      search: "",
      results: [],
      loading: false,
      failed: false,
      lastQuery: "",
    };
  },
  computed: {
    query() {
      return (this.search || "").trim();
    },
  },
  methods: {
    subtitle(result) {
      const type = TYPES[result.model_type] || "";
      const place = [result.zipcode, result.town].filter(Boolean).join(" ");
      return place ? `${type}, ${place}` : type;
    },
    goToResult(result) {
      this.$router.push(`/annuaire/${result.model_type}/${result.id}`);
    },
    async searchItems() {
      const query = this.query;
      if (query.length < 3) {
        this.results = [];
        this.loading = false;
        this.failed = false;
        return;
      }

      sessionStorage.setItem("search", query);
      this.lastQuery = query;
      this.loading = true;
      this.failed = false;

      try {
        const res = await axios.get(`${BASE_URL}/api/search`, { params: { query } });
        if (this.lastQuery === query) {
          this.results = Array.isArray(res.data) ? res.data : [];
        }
      } catch (e) {
        if (this.lastQuery === query) {
          this.results = [];
          this.failed = true;
        }
      } finally {
        if (this.lastQuery === query) {
          this.loading = false;
        }
      }
    },
  },
  watch: {
    search() {
      this.searchItems();
    },
  },
  setup() {
    return { peopleOutline, searchOutline };
  },
  mounted() {
    // La dernière recherche est conservée au retour d'une fiche
    this.search = sessionStorage.getItem("search") || "";
  },
};
</script>

<style scoped>
.directory-search {
  padding: 0 0 12px;
  --border-radius: var(--app-radius-control);
  --background: var(--app-surface);
  --box-shadow: inset 0 0 0 1px var(--app-border);
  --color: var(--app-text);
  --placeholder-color: var(--app-text-muted);
  --icon-color: var(--app-text-muted);
  --clear-button-color: var(--app-text-muted);
}

.result-count {
  margin: 0 4px 8px;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}

.app-avatar[slot="start"] {
  margin-inline-end: 14px;
}

.result-name {
  font-weight: 600;
}

ion-label p {
  color: var(--app-text-muted);
}
</style>
