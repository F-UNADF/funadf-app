<template>
  <ion-page>
    <ion-content class="feed-content" :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content pulling-text="Tire pour rafraîchir" refreshing-spinner="crescent" />
      </ion-refresher>

      <div class="feed-shell">
        <PostsShow v-for="post in items" :key="post.id" :post="post" />

        <div class="load-more">
          <ion-button v-if="!endOfFeed" expand="block" class="load-btn" :disabled="loading" @click="load"
            color="primary">
            <ion-spinner v-if="loading" name="crescent" class="btn-spinner" />
            <span v-else>Voir plus</span>
          </ion-button>

          <ion-item v-else lines="none" class="end-state">
            <ion-label>Il n’y a plus rien à voir.</ion-label>
          </ion-item>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { mapGetters } from "vuex";
import {
  IonPage,
  IonContent,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import PostsShow from "../components/Posts/show.vue";

export default {
  name: "HomePage",
  components: {
    PostsShow,
    IonPage,
    IonContent,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonItem,
    IonLabel,
  },
  computed: {
    ...mapGetters("feedStore", {
      items: "getItems",
      endOfFeed: "getEndOfFeed",
    }),
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async handleRefresh(ev) {
      try {
        await this.$store.dispatch("feedStore/initFeed");
        await this.$store.dispatch("feedStore/fetchFeed");
      } finally {
        ev.detail.complete();
      }
    },

    async load() {
      if (this.loading || this.endOfFeed) return;

      this.loading = true;
      try {
        // Si ton store a loadMore, utilise-le
        await this.$store.dispatch("feedStore/loadMore");
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    if (localStorage.getItem("token") === null) {
      this.$router.push({ name: "Login", replace: true });
      return;
    }

    this.$store.dispatch("sessionStore/fetchUser");
    this.$store.dispatch("feedStore/initFeed");
    this.load();
  },
};
</script>

<style scoped>
.feed-content {
  --background: var(--ion-background-color);
}

.feed-shell {
  padding: 12px 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.load-more {
  margin-top: 8px;
}

.load-btn {
  height: 44px;
  --border-radius: 16px;
}

.btn-spinner {
  width: 18px;
  height: 18px;
}

.end-state {
  --background: transparent;
  border: 1px solid var(--ion-color-border);
  border-radius: 14px;
  text-align: center;
}

.end-state ion-label {
  color: var(--ion-color-step-500);
  padding: 10px 0;
}
</style>