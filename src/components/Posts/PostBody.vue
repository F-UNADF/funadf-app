<template>
  <figure v-if="post.images && post.images.length" class="cover">
    <div class="cover-bg" :style="{ backgroundImage: `url(${post.images[0]})` }" aria-hidden="true"></div>
    <img :src="post.images[0]" alt="" class="cover-img" loading="lazy" />
  </figure>

  <div class="post-body">
    <div class="byline">
      <app-avatar :src="logoUrl" :name="structureName" :size="28" square />
      <span class="byline-name">{{ structureName }}</span>
      <time class="byline-date" :datetime="dateValue">{{ dateLabel }}</time>
    </div>

    <span v-if="post.pinned" class="app-pill pinned">
      <ion-icon :icon="pin" aria-hidden="true" />Épinglé
    </span>

    <h2 class="post-title">
      <router-link v-if="!full" :to="{ name: 'PostsShow', params: { id: post.id } }" class="title-link">
        {{ post.title }}
      </router-link>
      <template v-else>{{ post.title }}</template>
    </h2>

    <!-- Fil : résumé de quelques lignes ; détail : contenu complet -->
    <p v-if="!full && isLong" class="excerpt">{{ excerpt }}</p>
    <div v-else class="app-rich-text" v-html="post.content"></div>

    <router-link v-if="!full && isLong" :to="{ name: 'PostsShow', params: { id: post.id } }" class="read-more">
      Lire la suite
    </router-link>
  </div>

  <ion-list v-if="files.length" class="attachments" lines="inset">
    <ion-item v-for="file in files" :key="file.url" button :detail="false" @click="openAttachment(file.url)">
      <ion-icon slot="start" :icon="documentTextOutline" aria-hidden="true" />
      <ion-label class="ion-text-wrap">{{ file.label }}</ion-label>
      <ion-icon slot="end" :icon="openOutline" class="open-icon" aria-hidden="true" />
    </ion-item>
  </ion-list>
</template>

<script>
import { IonIcon, IonList, IonItem, IonLabel } from "@ionic/vue";
import { Browser } from "@capacitor/browser";
import { pin, documentTextOutline, openOutline } from "ionicons/icons";
import AppAvatar from "../Common/AppAvatar.vue";
import { BASE_URL, shortDate, plainText } from "@/utils/format";

const EXCERPT_LENGTH = 180;

export default {
  name: "PostBody",
  components: { IonIcon, IonList, IonItem, IonLabel, AppAvatar },
  props: {
    post: { type: Object, required: true },
    full: { type: Boolean, default: false },
  },
  computed: {
    structureName() {
      return (this.post.structure && this.post.structure.name) || "";
    },
    logoUrl() {
      const id = (this.post.structure && this.post.structure.id) || this.post.structure_id;
      return id ? `${BASE_URL}/logos/${id}.png?cache=v1` : "";
    },
    dateValue() {
      return this.post.published_at || this.post.updated_at || "";
    },
    dateLabel() {
      return shortDate(this.dateValue);
    },
    // Fil : liste d'URL (attachments) ; détail : objets { name, url } (existing_attachments)
    files() {
      const list = (this.post.attachments && this.post.attachments.length)
        ? this.post.attachments
        : (this.post.existing_attachments || []);
      return list.map((f, i) => (typeof f === "string"
        ? { url: f, label: this.attachmentLabel(f, i) }
        : { url: f.url, label: f.name || this.attachmentLabel(f.url, i) }));
    },
    text() {
      return plainText(this.post.content);
    },
    isLong() {
      return this.text.length > EXCERPT_LENGTH;
    },
    excerpt() {
      const cut = this.text.slice(0, EXCERPT_LENGTH);
      return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.]+$/, "") + "…";
    },
  },
  methods: {
    attachmentLabel(url, index) {
      try {
        const clean = url.split("?")[0];
        const name = decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1));
        return name && name.length < 60 ? name : `Pièce jointe ${index + 1}`;
      } catch (e) {
        return `Pièce jointe ${index + 1}`;
      }
    },
    openAttachment(url) {
      Browser.open({ url }).catch(() => window.open(url, "_blank"));
    },
  },
  setup() {
    return { pin, documentTextOutline, openOutline };
  },
};
</script>

<style scoped>
.cover {
  position: relative;
  margin: 0;
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--app-accent-soft);
}

/* L'affiche entière reste lisible : image nette contenue, fond flouté derrière */
.cover-bg {
  position: absolute;
  inset: -24px;
  background-size: cover;
  background-position: center;
  filter: blur(14px);
}

.cover-img {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.post-body {
  padding: 14px 16px 16px;
}

.byline {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.byline-name {
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--app-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.byline-date {
  flex: 0 0 auto;
  font-size: 0.8125rem;
  color: var(--app-text-muted);
}

.pinned {
  margin-top: 12px;
}

.post-title {
  margin: 12px 0 8px;
  font-size: 1.1875rem;
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--app-text);
}

.title-link {
  color: inherit;
  text-decoration: none;
}

.excerpt {
  margin: 0;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--app-text);
}

.read-more {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-bottom: -10px;
  font-weight: 600;
  color: var(--ion-color-primary);
  text-decoration: none;
}

.attachments {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--app-border);
  background: transparent;
}

.attachments ion-item {
  --background: transparent;
  --min-height: 52px;
}

.attachments ion-item ion-icon[slot="start"] {
  color: var(--ion-color-primary);
  margin-inline-end: 14px;
}

.open-icon {
  font-size: 18px;
  color: var(--app-text-muted);
}
</style>
