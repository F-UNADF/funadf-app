<template>
    <ion-page>
        <ion-content class="settings-page">
            <div class="settings-wrap">
                <h1 class="settings-title">Paramètres</h1>

                <!-- Compte -->
                <ion-list inset class="settings-group" v-if="hasUser">
                    <ion-item button detail @click="goTo('/user/edit')" class="account-item">
                        <div slot="start" class="account-avatar" aria-hidden="true">
                            <img v-if="!avatarFailed" :src="avatarUrl" alt="" @error="avatarFailed = true" />
                            <span v-else>{{ initials }}</span>
                        </div>
                        <ion-label>
                            <h2 class="account-name">{{ fullName }}</h2>
                            <p class="account-sub">Modifier mon profil</p>
                        </ion-label>
                    </ion-item>
                </ion-list>

                <!-- Notifications -->
                <h2 class="settings-group-title" id="settings-notifs">Notifications</h2>
                <ion-list inset class="settings-group" aria-labelledby="settings-notifs">
                    <ion-item lines="none">
                        <ion-icon slot="start" :icon="notificationsOutline" class="settings-icon" aria-hidden="true" />
                        <ion-toggle
                            :checked="pushChecked"
                            :disabled="pushToggleDisabled"
                            justify="space-between"
                            @ionChange="onPushToggle($event)"
                        >
                            <span class="toggle-label">Sur ce téléphone</span>
                            <span class="toggle-sub">Actualités, événements et votes</span>
                        </ion-toggle>
                    </ion-item>
                </ion-list>

                <div v-if="pushPermission === 'denied' && pushPref" class="settings-note settings-note--alert" role="status">
                    <p>Les notifications sont bloquées pour ADD+ dans les réglages du téléphone.</p>
                    <ion-button v-if="canOpenSettings" fill="clear" size="small" class="note-action" @click="openSettings">
                        Ouvrir les réglages
                    </ion-button>
                    <p v-else class="note-path">
                        Pour les autoriser : Paramètres du téléphone, Applications, ADD+, puis Notifications.
                    </p>
                </div>
                <p v-else-if="pushPermission === 'unsupported'" class="settings-note">
                    Les notifications push se règlent depuis l’application ADD+ sur votre téléphone.
                </p>
                <p v-else-if="pushPermission !== 'unknown' && !pushPref" class="settings-note">
                    Ce téléphone ne reçoit plus d’alertes. Vos notifications restent visibles dans l’app, sous la cloche.
                </p>

                <!-- Apparence -->
                <h2 class="settings-group-title" id="settings-theme">Apparence</h2>
                <ion-list inset class="settings-group">
                    <ion-radio-group :value="theme" @ionChange="onThemeChange($event)" aria-labelledby="settings-theme">
                        <ion-item>
                            <ion-radio value="system" justify="space-between">Comme le téléphone</ion-radio>
                        </ion-item>
                        <ion-item>
                            <ion-radio value="light" justify="space-between">Clair</ion-radio>
                        </ion-item>
                        <ion-item lines="none">
                            <ion-radio value="dark" justify="space-between">Sombre</ion-radio>
                        </ion-item>
                    </ion-radio-group>
                </ion-list>

                <!-- Déconnexion -->
                <ion-list inset class="settings-group settings-group--spaced" v-if="hasUser">
                    <ion-item button :detail="false" lines="none" @click="confirmLogout" class="logout-item">
                        <ion-label class="logout-label">Se déconnecter</ion-label>
                    </ion-item>
                </ion-list>

                <footer class="settings-footer">
                    <img src="/assets/ADD-plus-Bicouleur.svg" alt="ADD+" class="footer-logo footer-logo--light" />
                    <img src="/assets/ADD-plus-Blanc.svg" alt="ADD+" class="footer-logo footer-logo--dark" />
                    <p class="footer-version">{{ versionLabel }}</p>
                </footer>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonToggle,
    IonRadioGroup,
    IonRadio,
    IonButton,
    toastController,
    actionSheetController,
} from "@ionic/vue";
import { mapGetters } from "vuex";
import { notificationsOutline } from "ionicons/icons";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { getThemePreference, setThemePreference } from "@/services/theme";
import {
    isPushEnabled,
    getPushPermission,
    enablePush,
    disablePush,
    syncPushRegistration,
    canOpenAppSettings,
    openAppSettings,
    unregisterOnLogout,
} from "@/services/push";

const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://app.addfrance.fr"
        : "http://localhost:3000";

export default {
    name: "SettingsPage",
    components: {
        IonPage,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonIcon,
        IonToggle,
        IonRadioGroup,
        IonRadio,
        IonButton,
    },
    setup() {
        return { notificationsOutline };
    },
    data() {
        return {
            theme: getThemePreference(),
            pushPref: isPushEnabled(),
            // 'unknown' tant que la permission n'a pas été lue
            pushPermission: "unknown",
            // état affiché par l'interrupteur (piloté à la main : voir onPushToggle)
            pushChecked: false,
            pushBusy: false,
            canOpenSettings: canOpenAppSettings(),
            appVersion: null,
            avatarFailed: false,
            resumeListener: null,
        };
    },
    computed: {
        ...mapGetters("sessionStore", { user: "getUser" }),
        hasUser() {
            return !!(this.user && this.user.id);
        },
        fullName() {
            const name = [this.user.firstname, this.user.lastname].filter(Boolean).join(" ");
            return name || "Mon compte";
        },
        initials() {
            const letters = [this.user.firstname, this.user.lastname]
                .filter(Boolean)
                .map((part) => part.trim().charAt(0).toUpperCase());
            return letters.join("") || "?";
        },
        avatarUrl() {
            return `${BASE_URL}/avatars/${this.user.id}.png`;
        },
        pushToggleDisabled() {
            return this.pushBusy || this.pushPermission === "unknown" || this.pushPermission === "unsupported";
        },
        versionLabel() {
            if (!this.appVersion) return "Version navigateur";
            const { version, build } = this.appVersion;
            return build && build !== version ? `Version ${version} (${build})` : `Version ${version}`;
        },
    },
    watch: {
        "user.id"() {
            this.avatarFailed = false;
        },
    },
    methods: {
        goTo(path) {
            this.$router.push(path);
        },
        async toast(message, color = "dark") {
            const toast = await toastController.create({
                message,
                duration: 2500,
                color,
            });
            await toast.present();
        },
        tapFeedback() {
            if (!Capacitor.isNativePlatform()) return;
            Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
        },
        async refreshPushState() {
            this.pushPref = isPushEnabled();
            this.pushPermission = await getPushPermission();
            this.pushChecked = this.pushPref && this.pushPermission === "granted";
        },
        async onPushToggle(ev) {
            const wanted = ev.detail.checked;
            // On reflète tout de suite le geste, puis l'état réel une fois l'opération finie :
            // sans ça, un retour à « off » (permission refusée) ne serait pas redessiné.
            this.pushChecked = wanted;
            if (this.pushBusy) return;
            this.pushBusy = true;

            try {
                if (wanted) {
                    const result = await enablePush();
                    if (result === "granted") {
                        this.tapFeedback();
                        this.toast("Notifications activées");
                    } else if (result === "error") {
                        this.toast("Activation impossible pour le moment. Vérifiez la connexion et réessayez.", "danger");
                    }
                    // 'denied' : la note sous l'interrupteur explique quoi faire
                } else {
                    const done = await disablePush();
                    this.tapFeedback();
                    this.toast(done
                        ? "Notifications désactivées"
                        : "Notifications désactivées. La coupure sera finalisée au prochain lancement avec internet.");
                }
            } finally {
                await this.refreshPushState();
                this.pushBusy = false;
            }
        },
        openSettings() {
            openAppSettings();
        },
        onThemeChange(ev) {
            this.theme = setThemePreference(ev.detail.value);
        },
        async confirmLogout() {
            const sheet = await actionSheetController.create({
                header: "Se déconnecter de ADD+ sur ce téléphone ?",
                buttons: [
                    { text: "Se déconnecter", role: "destructive", data: { action: "logout" } },
                    { text: "Annuler", role: "cancel" },
                ],
            });
            await sheet.present();
            const { data } = await sheet.onDidDismiss();
            if (data && data.action === "logout") {
                await this.logout();
            }
        },
        async logout() {
            await unregisterOnLogout();
            await this.$store.dispatch("sessionStore/logout");
            // Rechargement complet, comme depuis le menu : l'état de l'app repart de zéro
            // et le routeur renvoie vers l'écran de connexion.
            window.location.replace("/login");
        },
        async onResume() {
            // L'utilisateur revient peut-être des réglages du téléphone
            await syncPushRegistration();
            await this.refreshPushState();
        },
    },
    async mounted() {
        this.refreshPushState();

        if (Capacitor.isNativePlatform()) {
            try {
                const info = await CapApp.getInfo();
                this.appVersion = { version: info.version, build: info.build };
            } catch (e) {
                this.appVersion = null;
            }
            try {
                this.resumeListener = await CapApp.addListener("resume", () => this.onResume());
            } catch (e) {
                this.resumeListener = null;
            }
        }
    },
    beforeUnmount() {
        if (this.resumeListener) {
            this.resumeListener.remove();
            this.resumeListener = null;
        }
    },
};
</script>

<style scoped>
.settings-page {
    --background: var(--ion-background-color);
}

.settings-wrap {
    max-width: 640px;
    margin: 0 auto;
    padding-top: 8px;
    padding-bottom: calc(32px + var(--ion-safe-area-bottom, 0px));
}

.settings-title {
    margin: 12px 20px 4px;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--ion-text-color);
}

.settings-group-title {
    margin: 24px 20px 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: rgba(var(--ion-text-color-rgb), 0.7);
}

.settings-group {
    margin-top: 8px;
    margin-bottom: 0;
}

/* Séparateurs : la valeur Ionic par défaut (step-150) est quasi blanche en sombre */
.settings-group ion-item {
    --border-color: var(--ion-color-border);
}

/* Ionic colle deux listes inset qui se suivent (margin-top: 0) : on garde l'écart */
.settings-wrap .settings-group.settings-group--spaced {
    margin-top: 32px;
}

.settings-icon {
    color: var(--ion-color-primary);
    font-size: 1.4rem;
}

.toggle-label,
.toggle-sub {
    display: block;
}

.toggle-label {
    font-size: 1rem;
    color: var(--ion-text-color);
}

.toggle-sub {
    margin-top: 2px;
    font-size: 0.85rem;
    color: rgba(var(--ion-text-color-rgb), 0.68);
    white-space: normal;
}

/* Note sous un groupe, à la manière des pieds de section iOS */
.settings-note {
    margin: 8px 20px 0;
    font-size: 0.85rem;
    line-height: 1.45;
    color: rgba(var(--ion-text-color-rgb), 0.68);
}

.settings-note p {
    margin: 0;
}

.settings-note--alert {
    padding: 12px 14px;
    border-radius: 12px;
    background: rgba(var(--ion-color-danger-rgb), 0.1);
    color: var(--ion-text-color);
}

.note-action {
    margin: 6px 0 0 -8px;
    --color: var(--ion-color-primary);
    font-weight: 600;
    min-height: 44px;
}

.note-path {
    margin-top: 6px !important;
    color: rgba(var(--ion-text-color-rgb), 0.75);
}

/* Compte */
.account-item {
    --padding-top: 6px;
    --padding-bottom: 6px;
}

.account-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--ion-color-primary-rgb), 0.12);
    color: var(--ion-color-primary);
    font-weight: 700;
    font-size: 1.05rem;
    flex-shrink: 0;
}

.account-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.account-name {
    font-size: 1.1rem !important;
    font-weight: 600 !important;
    color: var(--ion-text-color);
}

.account-sub {
    font-size: 0.85rem !important;
    color: rgba(var(--ion-text-color-rgb), 0.68) !important;
}

/* Déconnexion */
.logout-label {
    text-align: center;
    color: var(--ion-color-danger) !important;
    font-weight: 600;
}

/* Pied : logo et version */
.settings-footer {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.footer-logo {
    width: 56px;
    height: auto;
    opacity: 0.9;
}

.footer-logo--dark {
    display: none;
}

:root[data-theme="dark"] .footer-logo--light {
    display: none;
}

:root[data-theme="dark"] .footer-logo--dark {
    display: block;
}

.footer-version {
    margin: 0;
    font-size: 0.8rem;
    color: rgba(var(--ion-text-color-rgb), 0.6);
}
</style>
