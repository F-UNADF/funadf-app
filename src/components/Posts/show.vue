<template>
  <!-- Écran de détail (/posts/:id) : la carte est chargée depuis l'API -->
  <div v-if="standalone" class="app-screen post-screen">
    <list-skeleton v-if="status === 'loading'" variant="card" :count="1" />
    <screen-state v-else-if="status === 'error'" kind="error" title="Impossible d’afficher cette actualité"
      @action="loadPost" />
    <template v-else>
      <ion-card class="post-card">
        <post-body :post="localPost" :full="true" />
      </ion-card>
    </template>
  </div>

  <!-- Carte du fil -->
  <ion-card v-else class="post-card">
    <post-body :post="localPost" :full="false" />
  </ion-card>
</template>

<script>
import { IonCard } from "@ionic/vue";
import axios from "axios";
import PostBody from "./PostBody.vue";
import ScreenState from "../Common/ScreenState.vue";
import ListSkeleton from "../Common/ListSkeleton.vue";
import { BASE_URL } from "@/utils/format";

export default {
  name: "PostsShow",
  components: { IonCard, PostBody, ScreenState, ListSkeleton },
  props: {
    post: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      localPost: this.post || {},
      status: "ready",
    };
  },
  computed: {
    standalone() {
      return !this.post || Object.keys(this.post).length === 0;
    },
  },
  methods: {
    async loadPost() {
      if (!this.standalone) {
        this.localPost = this.post;
        return;
      }
      const postId = this.$route.params.id;
      if (!postId) return;
      this.status = "loading";
      try {
        const response = await axios.get(`${BASE_URL}/api/posts/${postId}`);
        this.localPost = response.data.post || {};
        this.status = "ready";
      } catch (e) {
        this.status = "error";
      }
    },
  },
  mounted() {
    this.loadPost();
  },
  watch: {
    post() {
      this.localPost = this.post;
    },
    "$route.params.id"(id) {
      if (id && this.standalone) this.loadPost();
    },
  },
};
</script>

<style scoped>
.post-card {
  margin: 0;
}

.post-screen {
  padding-top: var(--app-gutter);
}
</style>
