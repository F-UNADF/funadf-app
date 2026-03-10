<template>
  <ion-list v-if="localPost.id === null" class="skeleton-list">
    <ion-list-header>
      <ion-skeleton-text :animated="true" style="width: 120px"></ion-skeleton-text>
    </ion-list-header>
    <ion-item lines="none">
      <ion-thumbnail slot="start">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3><ion-skeleton-text :animated="true" style="width: 85%;"></ion-skeleton-text></h3>
        <p><ion-skeleton-text :animated="true" style="width: 65%;"></ion-skeleton-text></p>
        <p><ion-skeleton-text :animated="true" style="width: 35%;"></ion-skeleton-text></p>
      </ion-label>
    </ion-item>
  </ion-list>

  <ion-card v-else class="post-card">
    <!-- Cover -->
    <div class="cover" v-if="localPost.images?.length">
      <div class="cover-bg" :style="{ backgroundImage: `url(${localPost.images[0]})` }"></div>

      <img :src="localPost.images[0]" alt="Image" class="cover-img" />
    </div>

    <ion-card-header class="post-header">
      <div class="chip-row">
        <ion-chip class="structure-chip" color="primary">
          <ion-avatar>
            <img :src="getAvatar(localPost.structure?.id ?? localPost.structure_id)" alt="avatar" />
          </ion-avatar>
          <ion-label class="chip-label">{{ localPost.structure?.name }}</ion-label>
        </ion-chip>

        <ion-note class="date" color="medium">{{ displayDate(localPost.published_at || localPost.updated_at)
          }}</ion-note>
      </div>

      <ion-card-title class="post-title">{{ localPost.title }}</ion-card-title>
    </ion-card-header>

    <!-- Content -->
    <ion-card-content class="post-content" v-html="localPost.content"></ion-card-content>

    <!-- Attachments -->
    <ion-card-content v-if="localPost.attachments?.length" class="attachments">
      <ion-row>
        <ion-col v-for="(attachment, index) in localPost.attachments" :key="index" size="12" size-md="6">
          <ion-button :href="attachment" target="_blank" size="small" expand="block" fill="outline" class="attach-btn">
            {{ attachmentLabel(attachment, index) }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-card-content>
  </ion-card>
</template>

<script>
import {
  IonCard,
  IonItem,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonAvatar,
  IonLabel,
  IonRow,
  IonCol,
  IonButton,
  IonSkeletonText,
  IonList,
  IonListHeader,
  IonThumbnail,
  IonNote,
} from '@ionic/vue';
import axios from 'axios';

export default {
  name: "PostsShow",
  components: {
    IonCard,
    IonList,
    IonListHeader,
    IonCardContent,
    IonCardHeader,
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
    IonNote,
  },
  props: {
    post: { type: Object, default: () => ({}) },
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
        structure: { id: null, name: '' },
        published_at: null,
        updated_at: null,
      },
      avatarCacheKey: 'v1', // change à la mise à jour logo si besoin, pas à chaque rendu
    };
  },
  methods: {
    baseUrl() {
      return process.env.NODE_ENV === "production"
        ? "https://app.addfrance.fr"
        : "http://localhost:3000";
    },
    getAvatar(id) {
      if (!id) return '';
      return `${this.baseUrl()}/logos/${id}.png?cache=${this.avatarCacheKey}`;
    },
    displayDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const pad = (n) => n.toString().padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    },
    attachmentLabel(url, index) {
      try {
        const clean = url.split('?')[0];
        const name = decodeURIComponent(clean.substring(clean.lastIndexOf('/') + 1));
        // si rails redirect => nom pas utile, donc fallback
        return name && name.length < 40 ? name : `Pièce jointe ${index + 1}`;
      } catch {
        return `Pièce jointe ${index + 1}`;
      }
    },
    async loadPost() {
      // reset skeleton
      this.localPost.id = null;

      if (!this.post || Object.keys(this.post).length === 0) {
        const postId = this.$route.params.id;
        if (postId) {
          const response = await axios.get(`${this.baseUrl()}/api/posts/${postId}`);
          this.localPost = response.data.post;
        }
      } else {
        this.localPost = this.post;
      }
    }
  },
  async mounted() {
    await this.loadPost();
  },
  watch: {
    '$route.params.id'() {
      this.loadPost();
    }
  },
};
</script>

<style scoped>
.post-card {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--ion-color-border);
  box-shadow: none;
  background: var(--ion-card-background);
  margin: 10px;
}

.cover {
  position: relative;
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* image floutée derrière */
.cover-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.2);
  opacity: 1;
}

/* image nette */
.cover-img {
  position: relative;
  z-index: 1;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.post-header {
  padding-bottom: 8px;
}

.chip-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.structure-chip {
  --border-radius: 999px;
}

.chip-label {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date {
  font-size: 12px;
  white-space: nowrap;
  color: var(--ion-color-step-500);
}

.post-title {
  margin-top: 10px;
  font-size: 18px;
  letter-spacing: -0.2px;
}

/* Rendu HTML propre */
.post-content {
  padding-top: 0;
  /* color: var(--ion-text-color); */
}

.post-content :deep(p) {
  margin: 0 0 10px;
  line-height: 1.5;
}

.post-content :deep(a) {
  color: var(--ion-color-primary);
  text-decoration: none;
}

.attachments {
  padding-top: 6px;
}

.attach-btn {
  --border-radius: 14px;
}
</style>