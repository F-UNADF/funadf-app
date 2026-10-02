<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
    <ion-refresher-content pulling-text="Tirez pour actualiser" refreshing-spinner="crescent" />
  </ion-refresher>

  <div class="app-screen">
    <h1 class="app-title">Actualités</h1>

    <list-skeleton v-if="status === 'loading' && items.length === 0" variant="card" :count="2" />

    <screen-state v-else-if="status === 'error' && items.length === 0" kind="error" @action="reload" />

    <screen-state v-else-if="items.length === 0" :icon="newspaperOutline" title="Aucune actualité pour l’instant"
      text="Les annonces de votre église, de votre région et de l’Union apparaîtront ici." action="Actualiser"
      @action="reload" />

    <div v-else class="app-stack">
      <posts-show v-for="post in items" :key="post.id" :post="post" />
    </div>

    <ion-infinite-scroll :disabled="items.length === 0 || endOfFeed || status === 'error'" @ionInfinite="loadMore">
      <ion-infinite-scroll-content loading-spinner="crescent" />
    </ion-infinite-scroll>

    <p v-if="items.length > 0 && endOfFeed" class="feed-end">Vous avez tout vu.</p>
    <div v-if="items.length > 0 && status === 'error'" class="feed-end">
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
import { newspaperOutline } from "ionicons/icons";
import PostsShow from "../components/Posts/show.vue";
import ScreenState from "../components/Common/ScreenState.vue";
import ListSkeleton from "../components/Common/ListSkeleton.vue";
import { tapLight } from "@/utils/haptics";

export default {
  name: "FeedPage",
  components: {
    PostsShow,
    ScreenState,
    ListSkeleton,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  computed: {
    ...mapGetters("feedStore", {
      items: "getItems",
      endOfFeed: "getEndOfFeed",
    }),
  },
  data() {
    return {
      status: "loading", // loading | error | ready
    };
  },
  methods: {
    async reload() {
      this.status = "loading";
      try {
        await this.$store.dispatch("feedStore/initFeed");
        await this.$store.dispatch("feedStore/fetchFeed");
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
        await this.$store.dispatch("feedStore/loadMore");
        this.status = "ready";
      } catch (e) {
        this.status = "error";
      } finally {
        if (ev && ev.target) ev.target.complete();
      }
    },
  },
  setup() {
    return { newspaperOutline };
  },
  created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push({ name: "Login", replace: true });
      return;
    }
    this.$store.dispatch("sessionStore/fetchUser");
    this.reload();
  },
};
</script>

<style scoped>
.feed-end {
  margin: 20px 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}
</style>
