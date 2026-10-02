<template>
  <div class="app-screen edit-screen">
    <h1 class="app-title">Modifier mon profil</h1>

    <div class="photo-block">
      <app-avatar :src="takenPicture || avatarUrl" :name="fullName" :alt="`Photo de ${fullName}`" :size="96" />
      <ion-button fill="clear" class="photo-btn" :disabled="uploading" @click="takePicture">
        <ion-spinner v-if="uploading" slot="start" name="crescent" />
        <ion-icon v-else slot="start" :icon="cameraOutline" aria-hidden="true" />
        Changer la photo
      </ion-button>
    </div>

    <h2 class="app-section-title">Identité</h2>
    <ion-list class="app-inset-list">
      <ion-item>
        <ion-input v-model="editedUser.firstname" label="Prénom" label-placement="stacked" autocomplete="given-name"
          autocapitalize="words" enterkeyhint="next" />
      </ion-item>
      <ion-item>
        <ion-input v-model="editedUser.lastname" label="Nom" label-placement="stacked" autocomplete="family-name"
          autocapitalize="words" enterkeyhint="next" />
      </ion-item>
      <ion-item>
        <ion-input v-model="editedUser.birthdate" label="Date de naissance" label-placement="stacked" type="date"
          autocomplete="bday" />
      </ion-item>
    </ion-list>

    <h2 class="app-section-title">Coordonnées</h2>
    <ion-list class="app-inset-list">
      <ion-item>
        <ion-input v-model="editedUser.phone_1" label="Téléphone" label-placement="stacked" type="tel" inputmode="tel"
          autocomplete="tel" enterkeyhint="next" />
      </ion-item>
      <ion-item>
        <ion-input v-model="editedUser.address_1" label="Adresse" label-placement="stacked"
          autocomplete="street-address" enterkeyhint="next" />
      </ion-item>
      <ion-item>
        <ion-input v-model="editedUser.zipcode" label="Code postal" label-placement="stacked" inputmode="numeric"
          autocomplete="postal-code" maxlength="5" enterkeyhint="next" :class="{ 'ion-invalid ion-touched': zipInvalid }"
          error-text="Le code postal compte 5 chiffres." />
      </ion-item>
      <ion-item>
        <ion-input v-model="editedUser.town" label="Ville" label-placement="stacked" autocomplete="address-level2"
          autocapitalize="words" enterkeyhint="done" />
      </ion-item>
    </ion-list>

    <div class="app-action-bar">
      <ion-button expand="block" :disabled="saving || zipInvalid" @click="saveUser">
        <ion-spinner v-if="saving" name="crescent" />
        <span v-else>Enregistrer</span>
      </ion-button>
    </div>
  </div>
</template>

<script>
import { IonList, IonItem, IonInput, IonButton, IonIcon, IonSpinner } from "@ionic/vue";
import { cameraOutline } from "ionicons/icons";
import { mapGetters } from "vuex";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import AppAvatar from "../Common/AppAvatar.vue";
import { BASE_URL } from "@/utils/format";
import { success } from "@/utils/haptics";

export default {
  name: "UserEditComponent",
  components: { IonList, IonItem, IonInput, IonButton, IonIcon, IonSpinner, AppAvatar },
  data() {
    return {
      editedUser: {},
      takenPicture: null,
      cache: Date.now(),
      saving: false,
      uploading: false,
    };
  },
  computed: {
    ...mapGetters("sessionStore", {
      user: "getUser",
    }),
    fullName() {
      return [this.editedUser.firstname, this.editedUser.lastname].filter(Boolean).join(" ");
    },
    avatarUrl() {
      return this.user && this.user.id ? `${BASE_URL}/avatars/${this.user.id}.png?cache=${this.cache}` : "";
    },
    zipInvalid() {
      const zip = (this.editedUser.zipcode || "").toString().trim();
      return zip !== "" && !/^\d{5}$/.test(zip);
    },
  },
  watch: {
    user: {
      handler() {
        this.editedUser = JSON.parse(JSON.stringify(this.user || {}));
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    if (null === localStorage.getItem("token")) {
      this.$router.push({ name: "Login", replace: true });
      return;
    }
    this.$store.dispatch("sessionStore/fetchUser");
  },
  methods: {
    async saveUser() {
      if (this.saving) return;
      this.saving = true;

      try {
        const formData = new FormData();
        formData.append("user[user][lastname]", this.editedUser.lastname ?? "");
        formData.append("user[user][firstname]", this.editedUser.firstname ?? "");
        formData.append("user[user][address_1]", this.editedUser.address_1 ?? "");
        formData.append("user[user][zipcode]", this.editedUser.zipcode ?? "");
        formData.append("user[user][town]", this.editedUser.town ?? "");
        formData.append("user[user][phone_1]", this.editedUser.phone_1 ?? "");
        formData.append("user[user][birthdate]", this.editedUser.birthdate ?? "");

        await this.$store.dispatch("usersStore/save", { id: this.editedUser.id, payload: formData });
        await this.$store.dispatch("sessionStore/fetchUser");

        success();
        this.$root.presentToast("Profil enregistré");
        this.$router.push("/user");
      } catch (e) {
        this.$root.presentToast("Le profil n’a pas été enregistré. Vérifiez votre connexion et réessayez.", "danger");
      } finally {
        this.saving = false;
      }
    },

    async takePicture() {
      let image;
      try {
        image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          source: CameraSource.Prompt,
          resultType: CameraResultType.Uri,
          promptLabelHeader: "Photo de profil",
          promptLabelPhoto: "Choisir dans la galerie",
          promptLabelPicture: "Prendre une photo",
          promptLabelCancel: "Annuler",
        });
      } catch (e) {
        // Annulation par l'utilisateur ou accès refusé : rien à faire
        return;
      }

      this.takenPicture = image.webPath;
      this.uploading = true;
      try {
        const blob = await fetch(image.webPath).then((r) => r.blob());
        const formData = new FormData();
        formData.append("user[user][avatar]", blob, "photo.jpg");
        await this.$store.dispatch("usersStore/save", { id: this.user.id, payload: formData });
        this.cache = Date.now();
        success();
        this.$root.presentToast("Photo mise à jour");
      } catch (e) {
        this.takenPicture = null;
        this.$root.presentToast("La photo n’a pas été envoyée. Réessayez.", "danger");
      } finally {
        this.uploading = false;
      }
    },
  },
  setup() {
    return { cameraOutline };
  },
};
</script>

<style scoped>
.edit-screen {
  padding-bottom: 0;
}

.photo-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.photo-btn {
  min-height: 44px;
  font-weight: 600;
}

.app-action-bar {
  margin-top: 24px;
}

.app-action-bar ion-button {
  --border-radius: var(--app-radius-control);
  font-weight: 600;
}
</style>
