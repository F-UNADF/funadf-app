<template>
    <ion-page class="login-page">
        <ion-content :fullscreen="true" class="login-content">
            <div class="login-shell">
                <div class="brand">
                    <div class="logo" aria-label="Logo"></div>
                    <div class="brand-text">
                        <div class="brand-title">Connexion</div>
                        <div class="brand-subtitle">Accède à ton espace.</div>
                    </div>
                </div>

                <ion-card class="login-card" color="transparent">
                    <ion-card-content class="login-card-content">
                        <ion-item class="field" lines="none">
                            <ion-label position="floating">Email</ion-label>
                            <ion-input v-model="credential.email" name="email" type="email" inputmode="email"
                                spellcheck="false" autocapitalize="off" autocomplete="email" :disabled="loading"
                                @keydown.enter="login" />
                        </ion-item>

                        <ion-item class="field" lines="none">
                            <ion-label position="floating">Mot de passe</ion-label>

                            <ion-input v-model="credential.password" :type="showPassword ? 'text' : 'password'"
                                autocomplete="current-password" :disabled="loading" @keydown.enter="login" />

                            <ion-button slot="end" fill="clear" size="small" class="toggle-pass" :disabled="loading"
                                @click="togglePassword">
                                <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" />
                            </ion-button>
                        </ion-item>

                        <ion-button class="login-btn" shape="round" expand="block" color="primary"
                            :disabled="loading || !credential.email || !credential.password" @click="login">
                            <ion-spinner v-if="loading" name="crescent" class="btn-spinner" />
                            <span v-else>Connexion</span>
                        </ion-button>

                        <div class="hint">
                            En cas de souci, vérifiez votre email et votre mot de passe.
                        </div>
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonContent,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonIcon,
    IonSpinner,
} from '@ionic/vue';

import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

export default {
    name: 'LoginComponent',
    components: {
        IonPage,
        IonContent,
        IonLabel,
        IonInput,
        IonButton,
        IonCard,
        IonCardContent,
        IonItem,
        IonIcon,
        IonSpinner,
    },
    data() {
        return {
            credential: {
                email: '',
                password: '',
            },
            showPassword: false,
            loading: false,
            eyeOutline,
            eyeOffOutline,
        };
    },
    beforeCreate() {
        if (localStorage.getItem('token')) {
            this.$router.push({ name: 'user', replace: true });
        }
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        async login() {
            if (this.loading) return;

            this.loading = true;
            try {
                await this.$store.dispatch('sessionStore/login', this.credential);
                this.$root.presentToast('Vous êtes connecté !');
                this.$router.push({ name: 'Feed', replace: true });
            } catch (e) {
                this.$root.presentToast('Merci de vérifier vos informations !', 'danger');
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
/* Page background */
.login-page {
    background: var(--ion-background-color);
}

.login-content {
    --background: radial-gradient(900px 500px at 20% 10%,
            rgba(121, 138, 244, 0.18),
            transparent 60%),
        radial-gradient(800px 500px at 80% 0%,
            rgba(37, 26, 122, 0.14),
            transparent 55%),
        var(--ion-background-color);
}

/* Layout */
.login-shell {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 24px;
    max-width: 420px;
    margin: 0 auto;
    gap: 16px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 6px 4px;
    margin: 0 auto;
}

.brand-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.brand-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--ion-text-color);
    letter-spacing: -0.2px;
}

.brand-subtitle {
    font-size: 14px;
    color: var(--ion-color-step-500);
}

/* Logo */
.logo {
    background-image: url('../../public/assets/ADD-plus-Bicouleur.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 70px;
    width: 70px;
}

/* Dark switches logo asset */
@media (prefers-color-scheme: dark) {
    .logo {
        background-image: url('../../public/assets/ADD-plus-Bicouleur.svg');
    }
}

/* Card */
.login-card {
    box-shadow: none;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(229, 231, 235, 0.9);
    backdrop-filter: blur(10px);
}

@media (prefers-color-scheme: dark) {
    .login-card {
        background: rgba(17, 23, 65, 0.72);
        border: 1px solid rgba(27, 36, 86, 0.9);
    }
}

.login-card-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 18px;
}

/* Fields */
.field {
    --background: transparent;
    --border-radius: 14px;
    border: 1px solid var(--ion-color-border);
    border-radius: 14px;

    --min-height: 48px;
    align-items: center;
}

.field ion-input {
    font-size: 14px;
}

/* Make floating label feel nicer */
.field ion-label {
    margin: 0;
    color: var(--ion-color-step-500);
}

.toggle-pass {
    --color: var(--ion-color-step-500);
}

.login-btn {
    margin-top: 6px;
}

.btn-spinner {
    width: 18px;
    height: 18px;
}

.hint {
    font-size: 12px;
    color: var(--ion-color-step-500);
    text-align: center;
    padding-top: 4px;
}
</style>