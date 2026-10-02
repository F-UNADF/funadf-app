<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
    <ion-refresher-content pulling-text="Tirez pour actualiser" refreshing-spinner="crescent" />
  </ion-refresher>

  <div class="app-screen">
    <h1 class="app-title">Documents</h1>

    <ion-searchbar v-if="tree.length" v-model="query" class="doc-search" placeholder="Rechercher un document"
      :debounce="150" inputmode="search" enterkeyhint="search" />

    <list-skeleton v-if="status === 'loading' && tree.length === 0" variant="row" :count="5" />

    <screen-state v-else-if="status === 'error' && tree.length === 0" kind="error" @action="reload" />

    <screen-state v-else-if="tree.length === 0" :icon="folderOpenOutline" title="Aucun document partagé"
      text="Les statuts, formulaires et ressources mis à disposition apparaîtront ici." action="Actualiser"
      @action="reload" />

    <!-- Recherche : résultats à plat, avec le dossier d'origine -->
    <template v-else-if="searching">
      <ion-list v-if="matches.length" class="app-inset-list">
        <ion-item v-for="m in matches" :key="m.doc.id" button :detail="false" @click="openDocument(m.doc)">
          <ion-icon slot="start" :icon="m.doc.type === 'url' ? linkOutline : documentTextOutline" class="row-icon"
            aria-hidden="true" />
          <ion-label class="ion-text-wrap">
            {{ m.doc.name }}
            <p>{{ m.path }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <screen-state v-else :icon="searchOutline" title="Aucun document trouvé"
        text="Essayez un autre mot, ou parcourez les dossiers." />
    </template>

    <ion-list v-else class="app-inset-list">
      <nested-document v-for="item in tree" :key="item.id" :item="item" />
    </ion-list>
  </div>
</template>

<script>
import { IonList, IonItem, IonLabel, IonIcon, IonSearchbar, IonRefresher, IonRefresherContent } from "@ionic/vue";
import { folderOpenOutline, documentTextOutline, linkOutline, searchOutline } from "ionicons/icons";
import { mapGetters } from "vuex";
import NestedDocument from "./NestedDocument.vue";
import ScreenState from "../Common/ScreenState.vue";
import ListSkeleton from "../Common/ListSkeleton.vue";
import { openDocument } from "./openDocument";
import { tapLight } from "@/utils/haptics";

function normalize(text) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default {
  name: "DocumentsIndex",
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    NestedDocument,
    ScreenState,
    ListSkeleton,
  },
  data() {
    return {
      status: "loading",
      query: "",
    };
  },
  computed: {
    ...mapGetters("documentsStore", {
      items: "getItems",
    }),
    tree() {
      return Array.isArray(this.items) ? this.items : [];
    },
    searching() {
      return this.query.trim().length >= 2;
    },
    // Tous les documents de l'arbre, avec le chemin de leurs dossiers
    flat() {
      const out = [];
      const walk = (folder, path) => {
        const here = path ? `${path} › ${folder.name}` : folder.name;
        (folder.documents || []).forEach((doc) => out.push({ doc, path: here }));
        (folder.categories || []).forEach((sub) => walk(sub, here));
      };
      this.tree.forEach((f) => walk(f, ""));
      return out;
    },
    matches() {
      const q = normalize(this.query.trim());
      return this.flat.filter((m) => normalize(m.doc.name).includes(q) || normalize(m.doc.description).includes(q));
    },
  },
  methods: {
    openDocument,
    async reload() {
      this.status = "loading";
      try {
        await this.$store.dispatch("documentsStore/getItems");
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
  },
  setup() {
    return { folderOpenOutline, documentTextOutline, linkOutline, searchOutline };
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
.doc-search {
  padding: 0 0 12px;
  --border-radius: var(--app-radius-control);
  --background: var(--app-surface);
  --box-shadow: inset 0 0 0 1px var(--app-border);
  --color: var(--app-text);
  --placeholder-color: var(--app-text-muted);
  --icon-color: var(--app-text-muted);
}

.row-icon {
  color: var(--ion-color-primary);
  margin-inline-end: 14px;
}

ion-label p {
  color: var(--app-text-muted);
}
</style>
