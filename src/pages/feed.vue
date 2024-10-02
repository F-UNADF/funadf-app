<template>
  <ion-content>
    <ion-row v-if="!this.search_in_progress">
      <ion-col cols="12" v-for="post in items" :key="post.id">
        <ion-card>
          <img alt="Image" :src="post.images[0]" v-if="post.images.length > 0" />
          <ion-card-header>
            <ion-card-subtitle>
              <ion-chip>
                <ion-avatar>
                  <img
                    :src="'https://add-fnadf.fr/logos/' + post.post.structure_id + '.png?cahe=' + new Date().getTime()"
                    width="20" alt="avatar" />
                </ion-avatar>
                <ion-label>{{ post.structure.name }}</ion-label>
              </ion-chip>
            </ion-card-subtitle>
            <ion-card-title>{{ post.post.title }}</ion-card-title>
          </ion-card-header>

          <ion-card-content v-html="post.post.content"></ion-card-content>
          <ion-card-content>
            <ion-row v-if="post?.attachments" class="pb-3">
              <ion-col v-for="(attachment, index) in post?.attachments" :key="index" class="d-flex child-flex" cols="4">
                <ion-button :href="attachment" target="_blank" size="small" expand="block">
                  Pièce jointe {{ index + 1 }}
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
    <ion-col cols=" 12">
      <ion-button expand="block" color="primary" @click="load()" :loading="this.loading" v-if="!this.endOfFeed">
        VOIR PLUS
      </ion-button>
      <ion-button expand="block" color="secondary" v-else disabled>Il n'y a plus rien a voir !</ion-button>
    </ion-col>
  </ion-content>
</template>

<script>

import { mapGetters } from "vuex";
import { IonContent, IonButton, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonRow, IonCol, IonChip } from '@ionic/vue';

export default {
  name: "HomePage",
  components: { IonContent, IonButton, IonAvatar, IonLabel, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonRow, IonCol, IonChip },
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
    if (null === localStorage.getItem('token')) {
      this.$router.push({ name: 'Login', replace: true });
    }
    this.$store.dispatch('sessionStore/fetchUser');
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