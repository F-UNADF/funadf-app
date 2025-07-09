<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  <ion-content>
    <PostsShow v-for="post in items" :key="post.id" :post="post" />
    <ion-card color="transparent">
      <ion-button expand="block" color="primary" @click="load()" :loading="this.loading" v-if="!this.endOfFeed">
        VOIR PLUS
      </ion-button>
      <ion-button expand="block" color="secondary" v-else disabled>Il n'y a plus rien a voir !</ion-button>
    </ion-card>
  </ion-content>
</template>

<script>

import { mapGetters } from "vuex";
import { IonContent, IonButton, IonCard, IonRefresher, IonRefresherContent } from '@ionic/vue';
import PostsShow from '../components/Posts/show.vue';

export default {
  name: "HomePage",
  components: { PostsShow, IonContent, IonButton, IonRefresher, IonRefresherContent, IonCard },
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
    handleRefresh: function (event) {
      this.$store.dispatch('feedStore/initFeed');
      this.$store.dispatch('feedStore/fetchFeed').then(() => {
        setTimeout(() => {
          event.detail.complete();
        }, 2000);
      });
    },
    load: function () {
      this.$store.dispatch('feedStore/loadMore');
    },
    getAvatar: function (id) {
      let base_url =
        process.env.NODE_ENV === "production"
          ? "https://app.addfrance.fr"
          : "http://localhost:3000";
      return base_url + '/logos/' + id + '.png' + '?cache=' + new Date().getTime();
    },
  },
  beforeCreate: function () {
    if (null === localStorage.getItem('token')) {
      this.$router.push({ name: 'Login', replace: true });
    }
    this.$store.dispatch('sessionStore/fetchUser');
    this.$store.dispatch('feedStore/initFeed');
    this.$store.dispatch('feedStore/fetchFeed');
  },
  data() {
    return {
      loading: false,
      search_in_progress: false,
    };
  },
};
</script>

<style scoped>
ion-card-title {
  --color: #001521;
}

@media (prefers-color-scheme: dark) {
  ion-card-title {
    --color: #f8f9fa;
  }
}
</style>