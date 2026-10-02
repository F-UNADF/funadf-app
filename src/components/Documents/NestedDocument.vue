<template>
  <ion-item button :detail="false" class="folder-row" :style="indent" :aria-expanded="isOpen ? 'true' : 'false'"
    @click="toggle">
    <ion-icon slot="start" :icon="isOpen ? folderOpenOutline : folderOutline" class="row-icon" aria-hidden="true" />
    <ion-label class="ion-text-wrap">{{ item.name }}</ion-label>
    <span slot="end" class="count" :aria-label="`${total} éléments`">{{ total }}</span>
    <ion-icon slot="end" :icon="chevronDown" class="chevron" :class="{ open: isOpen }" aria-hidden="true" />
  </ion-item>

  <template v-if="isOpen">
    <nested-document v-for="child in item.categories" :key="`c-${child.id}`" :item="child" :depth="depth + 1" />

    <ion-item v-for="doc in item.documents" :key="`d-${doc.id}`" button :detail="false" class="doc-row"
      :style="childIndent" @click="openDocument(doc)">
      <ion-icon slot="start" :icon="doc.type === 'url' ? linkOutline : documentTextOutline" class="row-icon"
        aria-hidden="true" />
      <ion-label class="ion-text-wrap">
        {{ doc.name }}
        <p v-if="doc.description">{{ doc.description }}</p>
      </ion-label>
      <ion-icon slot="end" :icon="openOutline" class="open-icon" aria-hidden="true" />
    </ion-item>

    <ion-item v-if="total === 0" lines="none" class="empty-row" :style="childIndent">
      <ion-label class="app-muted">Dossier vide</ion-label>
    </ion-item>
  </template>
</template>

<script>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { folderOutline, folderOpenOutline, chevronDown, documentTextOutline, linkOutline, openOutline } from "ionicons/icons";
import { openDocument } from "./openDocument";
import { tapLight } from "@/utils/haptics";

export default {
  name: "NestedDocument",
  components: { IonItem, IonLabel, IonIcon },
  props: {
    item: { type: Object, required: true },
    depth: { type: Number, default: 0 },
  },
  data() {
    return { isOpen: false };
  },
  computed: {
    total() {
      return (this.item.categories || []).length + (this.item.documents || []).length;
    },
    indent() {
      return { "--padding-start": `${16 + this.depth * 20}px` };
    },
    childIndent() {
      return { "--padding-start": `${16 + (this.depth + 1) * 20}px` };
    },
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
      tapLight();
    },
    openDocument,
  },
  setup() {
    return { folderOutline, folderOpenOutline, chevronDown, documentTextOutline, linkOutline, openOutline };
  },
};
</script>

<style scoped>
.row-icon {
  color: var(--ion-color-primary);
  margin-inline-end: 14px;
}

.folder-row ion-label {
  font-weight: 600;
}

.count {
  font-size: 0.875rem;
  color: var(--app-text-muted);
  margin-inline-end: 6px;
}

.chevron {
  font-size: 18px;
  color: var(--app-text-muted);
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.doc-row ion-label p {
  color: var(--app-text-muted);
}

.open-icon {
  font-size: 18px;
  color: var(--app-text-muted);
}
</style>
