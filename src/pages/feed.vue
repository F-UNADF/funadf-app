<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  <ion-content>
    <ion-card v-for="post in items" :key="post.id">
      <img alt="Image" :src="post.images[0]" v-if="post.images.length > 0" />
      <ion-card-header>
        <ion-card-subtitle>
          <ion-chip>
            <ion-avatar>
              <img :src="getAvatar(post.post.structure_id)" width="20" alt="avatar" />
            </ion-avatar>
            <ion-label>{{ post.structure.name }}</ion-label>
          </ion-chip>
        </ion-card-subtitle>
        <ion-card-title>{{ post.post.title }}</ion-card-title>
      </ion-card-header>
      <ion-card-content v-html="post.post.content"></ion-card-content>
      <ion-card-content>
        <ion-row v-if="post?.attachments">
          <ion-col v-for="(attachment, index) in post?.attachments" :key="index" size="4">
            <ion-button :href="attachment" target="_blank" size="small" expand="block">
              Pièce jointe {{ index + 1 }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-card-content>
    </ion-card>
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
import { IonContent, IonButton, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonRow, IonCol, IonChip, IonRefresher, IonRefresherContent } from '@ionic/vue';

export default {
  name: "HomePage",
  components: { IonContent, IonButton, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonRow, IonCol, IonChip, IonRefresher, IonRefresherContent },
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
          ? "https://add-fnadf.fr"
          : "http://app.localhost:3000";
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

<style scoped></style>