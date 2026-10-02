<template>
  <div class="screen-state" :class="`is-${kind}`" :role="kind === 'error' ? 'alert' : 'status'">
    <div class="state-icon" aria-hidden="true">
      <ion-icon :icon="resolvedIcon" />
    </div>
    <p class="state-title">{{ resolvedTitle }}</p>
    <p v-if="resolvedText" class="state-text">{{ resolvedText }}</p>
    <ion-button v-if="resolvedAction" fill="outline" class="state-action" @click="$emit('action')">
      <ion-icon v-if="kind === 'error'" slot="start" :icon="refreshOutline" />
      {{ resolvedAction }}
    </ion-button>
  </div>
</template>

<script>
import { IonButton, IonIcon } from "@ionic/vue";
import { cloudOfflineOutline, refreshOutline, fileTrayOutline } from "ionicons/icons";

// État d'un écran de données : vide (kind="empty") ou erreur (kind="error").
// L'erreur propose toujours « Réessayer » : écouter @action pour relancer le chargement.
export default {
  name: "ScreenState",
  components: { IonButton, IonIcon },
  props: {
    kind: { type: String, default: "empty" },
    icon: { type: [String, Object], default: null },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    action: { type: String, default: "" },
  },
  emits: ["action"],
  computed: {
    resolvedIcon() {
      return this.icon || (this.kind === "error" ? cloudOfflineOutline : fileTrayOutline);
    },
    resolvedTitle() {
      return this.title || (this.kind === "error" ? "Chargement impossible" : "Rien à afficher");
    },
    resolvedText() {
      if (this.text) return this.text;
      return this.kind === "error" ? "Vérifiez votre connexion internet, puis réessayez." : "";
    },
    resolvedAction() {
      return this.action || (this.kind === "error" ? "Réessayer" : "");
    },
  },
  setup() {
    return { refreshOutline };
  },
};
</script>

<style scoped>
.screen-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px 32px;
}

.state-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: var(--app-accent-soft);
  color: var(--app-accent-ink);
  font-size: 30px;
  margin-bottom: 16px;
}

.is-error .state-icon {
  background: rgba(var(--ion-color-danger-rgb), 0.12);
  color: var(--ion-color-danger);
}

.state-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--app-text);
}

.state-text {
  margin: 6px 0 0;
  max-width: 30ch;
  font-size: 0.9375rem;
  line-height: 1.45;
  color: var(--app-text-muted);
}

.state-action {
  margin-top: 20px;
  min-height: 44px;
  --border-radius: var(--app-radius-control);
}
</style>
