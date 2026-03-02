<template>
    <ion-page class="profile-page">
        <ion-content :fullscreen="true" class="profile-content">
            <!-- Header / avatar -->
            <div class="profile-hero">
                <div class="avatar-wrap">
                    <img class="avatar" :src="takenPicture ? takenPicture : getAvatar" alt="Avatar" />
                    <ion-button class="avatar-btn" size="small" shape="round" fill="solid" @click="takePicture">
                        Changer
                    </ion-button>
                </div>

                <div class="profile-title">
                    <div class="name">
                        {{ editedUser.firstname || 'Prénom' }} {{ editedUser.lastname || 'Nom' }}
                    </div>
                    <div class="subtitle">Ton profil public</div>
                </div>
            </div>

            <!-- Form card -->
            <ion-card class="profile-card" color="transparent">
                <ion-card-content class="profile-card-content">
                    <ion-item class="field" lines="none">
                        <ion-label position="stacked">Nom</ion-label>
                        <ion-input v-model="editedUser.lastname" />
                    </ion-item>

                    <ion-item class="field" lines="none">
                        <ion-label position="stacked">Prénom</ion-label>
                        <ion-input v-model="editedUser.firstname" />
                    </ion-item>

                    <ion-item class="field" lines="none">
                        <ion-label position="stacked">Adresse</ion-label>
                        <ion-input v-model="editedUser.address_1" />
                    </ion-item>

                    <div class="row">
                        <ion-item class="field half" lines="none">
                            <ion-label position="stacked">Code postal</ion-label>
                            <ion-input inputmode="numeric" v-model="editedUser.zipcode" />
                        </ion-item>

                        <ion-item class="field half" lines="none">
                            <ion-label position="stacked">Ville</ion-label>
                            <ion-input v-model="editedUser.town" />
                        </ion-item>
                    </div>

                    <ion-item class="field" lines="none">
                        <ion-label position="stacked">Téléphone</ion-label>
                        <ion-input inputmode="tel" v-model="editedUser.phone_1" />
                    </ion-item>

                    <ion-item class="field" lines="none">
                        <ion-label position="stacked">Date de naissance</ion-label>
                        <ion-input type="date" v-model="editedUser.birthdate" />
                    </ion-item>
                </ion-card-content>
            </ion-card>

            <!-- Spacer for fixed button -->
            <div class="bottom-spacer"></div>
        </ion-content>

        <!-- Fixed save button -->
        <div class="save-bar">
            <ion-button expand="block" shape="round" class="save-btn" :disabled="saving" @click="saveUser">
                <ion-spinner v-if="saving" name="crescent" class="btn-spinner" />
                <span v-else>Enregistrer</span>
            </ion-button>
        </div>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonLabel,
    IonButton,
    IonItem,
    IonSpinner,
} from '@ionic/vue';
import { mapGetters } from 'vuex';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default {
    name: 'UserShowComponent',
    components: {
        IonPage,
        IonContent,
        IonCard,
        IonCardContent,
        IonInput,
        IonLabel,
        IonButton,
        IonItem,
        IonSpinner,
    },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
            token: 'getToken',
        }),
        getAvatar() {
            let base_url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.addfrance.fr';
            return `${base_url}/avatars/${this.user.id}.png?cache=${this.cache}`;
        },
    },
    data() {
        return {
            editedUser: {},
            takenPicture: null,
            cache: Date.now(),
            saving: false,
        };
    },
    watch: {
        user: {
            handler() {
                this.editedUser = JSON.parse(JSON.stringify(this.user));
            },
            deep: true,
            immediate: true,
        },
    },
    beforeCreate() {
        this.$store.dispatch('sessionStore/fetchUser');

        if (this.token === null) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
    methods: {
        async saveUser() {
            if (this.saving) return;
            this.saving = true;

            try {
                const formData = new FormData();
                formData.append('user[user][lastname]', this.editedUser.lastname ?? '');
                formData.append('user[user][firstname]', this.editedUser.firstname ?? '');
                formData.append('user[user][address_1]', this.editedUser.address_1 ?? '');
                formData.append('user[user][zipcode]', this.editedUser.zipcode ?? '');
                formData.append('user[user][town]', this.editedUser.town ?? '');
                formData.append('user[user][phone_1]', this.editedUser.phone_1 ?? '');
                formData.append('user[user][birthdate]', this.editedUser.birthdate ?? '');

                await this.$store.dispatch('usersStore/save', { id: this.editedUser.id, payload: formData });

                this.$root.presentToast('Votre profil a été mis à jour !');
                this.$router.push('/user');
            } finally {
                this.saving = false;
            }
        },

        async takePicture() {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                source: CameraSource.Prompt,
                resultType: CameraResultType.Uri,

                promptLabelHeader: 'Photo de profil',
                promptLabelPhoto: 'Prendre une photo',
                promptLabelPicture: 'Choisir dans la galerie',
                promptLabelCancel: 'Annuler',
            });

            // Preview
            this.takenPicture = image.webPath;

            // Upload
            const blob = await fetch(image.webPath).then((r) => r.blob());

            const formData = new FormData();
            formData.append('user[user][avatar]', blob, 'photo.jpg');

            await this.$store.dispatch('usersStore/save', { id: this.user.id, payload: formData });
            this.$root.presentToast('Votre avatar a été mis à jour !');
            this.cache = Date.now();
        },
    },
};
</script>

<style scoped>
.profile-content {
    --background: var(--ion-background-color);
}

.profile-hero {
    padding: 18px 18px 10px;
    display: flex;
    align-items: center;
    gap: 14px;
}

.avatar-wrap {
    position: relative;
    width: 82px;
    height: 82px;
    flex: 0 0 auto;
}

.avatar {
    width: 82px;
    height: 82px;
    border-radius: 22px;
    object-fit: cover;
    border: 1px solid var(--ion-color-border);
    background: var(--ion-card-background);
}

.avatar-btn {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    height: 28px;
    font-size: 12px;
    --padding-start: 10px;
    --padding-end: 10px;
    --color: var(--ion-color-primary-contrast);
}

.profile-title .name {
    font-weight: 800;
    font-size: 18px;
    color: var(--ion-text-color);
    letter-spacing: -0.2px;
}

.profile-title .subtitle {
    margin-top: 4px;
    font-size: 13px;
    color: var(--ion-color-step-500);
}

.profile-card {
    margin: 10px 12px 0;
    border-radius: 18px;
    border: 1px solid var(--ion-color-border);
    box-shadow: none;
    background: var(--ion-card-background);
}

.profile-card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
}

.field {
    --background: transparent;
    border: 1px solid var(--ion-color-border);
    border-radius: 14px;
    padding: 2px 10px;
    --min-height: 48px;
}

.field ion-label {
    color: var(--ion-color-step-500);
    font-size: 13px;
}

.field ion-input {
    --padding-top: 10px;
    --padding-bottom: 10px;
    font-size: 14px;
}

.row {
    display: flex;
    gap: 10px;
}

.half {
    flex: 1;
}

/* espace pour le bouton fixe */
.bottom-spacer {
    height: 86px;
}

.save-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    background: linear-gradient(to top, var(--ion-background-color), rgba(0, 0, 0, 0));
    backdrop-filter: blur(10px);
}

.save-btn {
    height: 46px;
    --border-radius: 16px;
    --color: var(--ion-color-primary-contrast);
}

.btn-spinner {
    width: 18px;
    height: 18px;
}
</style>