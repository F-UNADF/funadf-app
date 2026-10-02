<template>
  <div class="profile">
    <div class="profile-head">
      <app-avatar :src="avatarSrc" :name="name" :alt="`Photo de ${name}`" :size="96" :square="square" />
      <h1 class="profile-name">{{ name }}</h1>
      <p v-if="caption" class="profile-caption">{{ caption }}</p>
      <div v-if="pills.length" class="profile-pills">
        <span v-for="pill in pills" :key="pill" class="app-pill">{{ pill }}</span>
      </div>
      <slot name="actions" />
    </div>

    <template v-if="hasContacts">
      <h2 class="app-section-title">Coordonnées</h2>
      <ion-list class="app-inset-list">
        <ion-item v-if="email" :href="`mailto:${email}`" :detail="false">
          <ion-icon slot="start" :icon="mailOutline" aria-hidden="true" />
          <ion-label class="ion-text-wrap">
            <p>E-mail</p>
            <span class="contact-value">{{ email }}</span>
          </ion-label>
        </ion-item>
        <ion-item v-if="phone" :href="`tel:${phoneHref}`" :detail="false">
          <ion-icon slot="start" :icon="callOutline" aria-hidden="true" />
          <ion-label class="ion-text-wrap">
            <p>Téléphone</p>
            <span class="contact-value">{{ phone }}</span>
          </ion-label>
        </ion-item>
        <ion-item v-if="place">
          <ion-icon slot="start" :icon="locationOutline" aria-hidden="true" />
          <ion-label class="ion-text-wrap">
            <p>Ville</p>
            <span class="contact-value">{{ place }}</span>
          </ion-label>
        </ion-item>
      </ion-list>
    </template>

    <slot />
  </div>
</template>

<script>
import { IonList, IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { mailOutline, callOutline, locationOutline } from "ionicons/icons";
import AppAvatar from "./AppAvatar.vue";

// Fiche de l'annuaire et du profil : en-tête (photo, nom, puces) puis coordonnées.
export default {
  name: "ProfileView",
  components: { IonList, IonItem, IonLabel, IonIcon, AppAvatar },
  props: {
    name: { type: String, default: "" },
    caption: { type: String, default: "" },
    avatarSrc: { type: String, default: "" },
    square: { type: Boolean, default: false },
    pills: { type: Array, default: () => [] },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    place: { type: String, default: "" },
  },
  computed: {
    hasContacts() {
      return !!(this.email || this.phone || this.place);
    },
    phoneHref() {
      return (this.phone || "").replace(/[^\d+]/g, "");
    },
  },
  setup() {
    return { mailOutline, callOutline, locationOutline };
  },
};
</script>

<style scoped>
.profile-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 0 8px;
}

.profile-name {
  margin: 14px 0 0;
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--app-text);
}

.profile-caption {
  margin: 4px 0 0;
  font-size: 0.9375rem;
  color: var(--app-text-muted);
}

.profile-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

ion-item ion-icon[slot="start"] {
  color: var(--ion-color-primary);
  margin-inline-end: 16px;
}

ion-label p {
  font-size: 0.8125rem;
  color: var(--app-text-muted);
}

.contact-value {
  color: var(--app-text);
}
</style>
