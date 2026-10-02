<template>
  <div class="skeletons" aria-busy="true" aria-label="Chargement en cours">
    <template v-for="n in count" :key="n">
      <!-- Carte d'actualité : visuel, puis texte -->
      <div v-if="variant === 'card'" class="sk-card">
        <ion-skeleton-text v-if="n === 1" animated class="sk-cover" />
        <div class="sk-body">
          <ion-skeleton-text animated style="width: 40%; height: 12px" />
          <ion-skeleton-text animated style="width: 90%; height: 18px; margin-top: 12px" />
          <ion-skeleton-text animated style="width: 100%; height: 12px; margin-top: 12px" />
          <ion-skeleton-text animated style="width: 75%; height: 12px" />
        </div>
      </div>

      <!-- Événement : tuile de date + texte -->
      <div v-else-if="variant === 'event'" class="sk-card sk-row">
        <ion-skeleton-text animated class="sk-tile" />
        <div class="sk-lines">
          <ion-skeleton-text animated style="width: 80%; height: 16px" />
          <ion-skeleton-text animated style="width: 55%; height: 12px; margin-top: 10px" />
          <ion-skeleton-text animated style="width: 35%; height: 12px" />
        </div>
      </div>

      <!-- Ligne de liste : icône ou avatar + deux lignes -->
      <div v-else class="sk-line">
        <ion-skeleton-text animated class="sk-avatar" />
        <div class="sk-lines">
          <ion-skeleton-text animated style="width: 65%; height: 14px" />
          <ion-skeleton-text animated style="width: 40%; height: 11px; margin-top: 8px" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { IonSkeletonText } from "@ionic/vue";

// Squelettes de chargement qui reprennent la forme du contenu attendu.
export default {
  name: "ListSkeleton",
  components: { IonSkeletonText },
  props: {
    variant: { type: String, default: "row" }, // card | event | row
    count: { type: Number, default: 3 },
  },
};
</script>

<style scoped>
.skeletons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sk-card {
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-card);
  background: var(--app-surface);
  overflow: hidden;
}

.sk-cover {
  display: block;
  margin: 0;
  height: 180px;
  border-radius: 0;
}

.sk-body {
  padding: 16px;
}

.sk-row {
  display: flex;
  gap: 14px;
  padding: 14px;
}

.sk-tile {
  flex: 0 0 auto;
  width: 56px;
  height: 64px;
  margin: 0;
  border-radius: 12px;
}

.sk-lines {
  flex: 1;
  min-width: 0;
}

.sk-line {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 4px;
}

.sk-avatar {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  margin: 0;
  border-radius: 12px;
}
</style>
