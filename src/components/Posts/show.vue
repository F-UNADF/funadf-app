<template>
  <ion-list v-if="this.localPost.id === null">
    <ion-list-header>
      <ion-skeleton-text :animated="true" style="width: 80px"></ion-skeleton-text>
    </ion-list-header>
    <ion-item>
      <ion-thumbnail slot="start">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
  <ion-card v-else>
    <img alt="Image" :src="localPost.images[0]" v-if="localPost.images.length > 0" />
    <ion-card-header>
      <ion-card-subtitle>
        <ion-chip>
          <ion-avatar>
            <img :src="getAvatar(localPost.structure_id)" width="20" alt="avatar" />
          </ion-avatar>
          <ion-label>{{ localPost.structure.name }}</ion-label>
        </ion-chip>
      </ion-card-subtitle>
      <ion-card-title>{{ localPost.title }}</ion-card-title>
    </ion-card-header>
    <ion-card-content v-html="localPost.content"></ion-card-content>
    <ion-card-content>
      <ion-row v-if="localPost?.attachments">
        <ion-col v-for="(attachment, index) in localPost?.attachments" :key="index" size="6">
          <ion-button :href="attachment" target="_blank" size="small" expand="block">
            Pièce jointe {{ index + 1 }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-card-content>
  </ion-card>
</template>

<script>
import { IonCard, IonItem, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonAvatar, IonLabel, IonRow, IonCol, IonButton, IonSkeletonText, IonList, IonListHeader, IonThumbnail } from '@ionic/vue';
import axios from 'axios';

export default {
  name: "PostsShow",
  components: {
    IonCard,
    IonList,
    IonListHeader,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonAvatar,
    IonLabel,
    IonRow,
    IonCol,
    IonButton,
    IonThumbnail,
    IonItem,
    IonSkeletonText,
  },
  props: {
    post: {
      type: Object,
      default: () => ({})
    },
  },
  methods: {
    getAvatar: function (id) {
      let base_url =
        process.env.NODE_ENV === "production"
          ? "https://app.addfrance.fr"
          : "http://localhost:3000";
      return base_url + '/logos/' + id + '.png' + '?cache=' + new Date().getTime();
    },
    async loadPost() {
      this.localPost = {
        id: null,
        title: '',
        content: '',
        images: [],
        attachments: [],
        structure_id: null,
        structure: {
          name: ''
        },
      };
      // Si post props est vide, on recupere le paramètre ID de l'URL
      if (!this.post || Object.keys(this.post).length === 0) {
        const postId = this.$route.params.id;
        if (postId) {
          let base_url =
            process.env.NODE_ENV === "production"
              ? "https://app.addfrance.fr"
              : "http://localhost:3000";
          const response = await axios.get(`${base_url}/api/posts/${postId}`);
          this.localPost = response.data.post;
        }
      } else {
        this.localPost = this.post;
      }
    }
  },
  async mounted() {
    // Appel de la méthode pour charger le post
    await this.loadPost();
  },
  watch: {
    '$route.params.id'() {
      this.loadPost(); // Re-fetch ou autre
    }
  },
  data() {
    return {
      localPost: {
        id: null,
        title: '',
        content: '',
        images: [],
        attachments: [],
        structure_id: null,
        structure: {
          name: ''
        },
      },
    };
  },
};
</script>