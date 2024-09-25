<template>
  <ion-content>
    <ion-row v-if="!this.search_in_progress">
      <ion-row v-for="post in items" :key="post.id">
        <ion-card>
          <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
          <ion-card-header>
            <ion-card-title>{{ post.post.title }}</ion-card-title>
            <ion-card-subtitle>{{ post.structure.name }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content v-html="post.post.content"></ion-card-content>
        </ion-card>
      </ion-row>
    </ion-row>
    <ion-col cols="12" v-if="this.search_in_progress">
      <ion-row>
        <ion-col>
          <v-progress-circular style="display: block; margin: 0 auto;" color="primary" indeterminate :size="50"
            :width="8"></v-progress-circular>
        </ion-col>
      </ion-row>
    </ion-col>
    <ion-col cols="12">
      <ion-button expand="block" color="primary" @click="load()" :loading="this.loading" v-if="!this.endOfFeed">
        VOIR PLUS
      </ion-button>
      <ion-button expand="block" color="secondary" v-else disabled>Il n'y a plus rien a voir !</ion-button>
    </ion-col>
  </ion-content>
</template>

<script>

import { mapGetters } from "vuex";
import { IonContent, IonButton } from '@ionic/vue';

export default {
  name: "HomePage",
  components: { IonContent, IonButton },
  computed: {
    ...mapGetters('sessionStore', {
      user: 'getUser',
      church: 'getChurch',
      token: 'getToken',
    }),
    ...mapGetters('feedStore', {
      items: 'getItems',
      endOfFeed: 'getEndOfFeed',
    }),
  },
  methods: {
    load: function () {
      this.$store.dispatch('feedStore/loadMore');
    },
  },
  beforeCreate: function () {
    this.$store.dispatch('sessionStore/fetchUser');
    this.$store.dispatch('feedStore/fetchFeed');

    if (null === this.token || null === this.user) {
      this.$router.push({ name: 'Login', replace: true });
    }
  },
  data() {
    return {
      loading: false,
      search_in_progress: false,
    };
  },
};
</script>

<style scoped></style>