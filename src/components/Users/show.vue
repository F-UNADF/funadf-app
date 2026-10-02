<template>
  <profile-view :name="fullName" :avatar-src="avatarUrl" :pills="pills" :email="user.email || ''"
    :phone="user.phone_1 || ''" :place="user.town || ''">
    <template v-if="canEdit" #actions>
      <ion-button fill="outline" size="default" class="edit-btn" @click="goToEdit">
        <ion-icon slot="start" :icon="createOutline" aria-hidden="true" />
        Modifier mon profil
      </ion-button>
    </template>

    <template v-if="church && churchName">
      <h2 class="app-section-title">Église</h2>
      <ion-list class="app-inset-list">
        <ion-item :button="!!churchId" :detail="!!churchId" @click="goToChurch">
          <ion-icon slot="start" :icon="homeOutline" aria-hidden="true" />
          <ion-label class="ion-text-wrap">
            <span class="church-name">{{ churchName }}</span>
            <p v-if="church.town">{{ church.town }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </template>
  </profile-view>
</template>

<script>
import { IonButton, IonIcon, IonList, IonItem, IonLabel } from "@ionic/vue";
import { createOutline, homeOutline } from "ionicons/icons";
import ProfileView from "../Common/ProfileView.vue";
import { BASE_URL } from "@/utils/format";

export default {
  name: "UserShowComponent",
  components: { IonButton, IonIcon, IonList, IonItem, IonLabel, ProfileView },
  props: {
    user: { type: Object, required: true },
    church: { type: Object, default: null },
    canEdit: { type: Boolean, default: true },
  },
  computed: {
    fullName() {
      return [this.user.firstname, this.user.lastname].filter(Boolean).join(" ");
    },
    avatarUrl() {
      return this.user.id ? `${BASE_URL}/avatars/${this.user.id}.png?cache=v1` : "";
    },
    pills() {
      const out = [];
      if (this.user.level) out.push(this.user.level);
      if (this.user.id) out.push(`N° ${String(this.user.id).padStart(5, "0")}`);
      return out;
    },
    // Profil : la phase en cours (church_id) ; annuaire : l'église (id)
    churchId() {
      return this.church && (this.church.church_id || this.church.id);
    },
    churchName() {
      return this.church && this.church.name;
    },
  },
  methods: {
    goToEdit() {
      this.$router.push("/user/edit");
    },
    goToChurch() {
      if (this.churchId) this.$router.push(`/annuaire/churches/${this.churchId}`);
    },
  },
  setup() {
    return { createOutline, homeOutline };
  },
};
</script>

<style scoped>
.edit-btn {
  margin-top: 16px;
  min-height: 44px;
  --border-radius: var(--app-radius-control);
  font-weight: 600;
}

ion-item ion-icon[slot="start"] {
  color: var(--ion-color-primary);
  margin-inline-end: 16px;
}

.church-name {
  font-weight: 600;
}

ion-label p {
  color: var(--app-text-muted);
}
</style>
