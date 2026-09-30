<template>
    <ion-page>
        <ion-header v-if="loggedIn">
            <ion-toolbar class="app-toolbar gradient-header">
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <ion-img src="/assets/ADD-plus-Bicouleur.svg" class="add-logo"></ion-img>
                </ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" class="notif-button" @click="openEndMenu()">
                        <ion-icon :icon="notificationsOutline" />
                        <ion-badge v-if="unreadNotifications > 0" color="danger" class="notification-badge">
                            {{ unreadNotifications }}
                        </ion-badge>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-menu side="start" content-id="main-content" type="push">
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title>Menu</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-menu-toggle>
                        <ion-item lines="none" class="menu-item" @click="routeTo('/user')">
                            <ion-icon slot="start" :icon="personCircle"></ion-icon>
                            <ion-label>Mon profil</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" @click="routeTo('/carte')">
                            <ion-icon slot="start" :icon="idCard"></ion-icon>
                            <ion-label>Ma carte pastorale</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" @click="routeTo('/annuaire')">
                            <ion-icon slot="start" :icon="search"></ion-icon>
                            <ion-label>Annuaire</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" @click="routeTo('/feed')">
                            <ion-icon slot="start" :icon="newspaper"></ion-icon>
                            <ion-label>Actualités</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" @click="routeTo('/documents')">
                            <ion-icon slot="start" :icon="folderOpen"></ion-icon>
                            <ion-label>Documents</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" @click="routeTo('/agenda')">
                            <ion-icon slot="start" :icon="calendarNumber"></ion-icon>
                            <ion-label>Agenda</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" @click="routeTo('/votes')">
                            <ion-icon slot="start" :icon="thumbsUp"></ion-icon>
                            <ion-label>Votes</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" @click="routeTo('/cotisations')">
                            <ion-icon slot="start" :icon="cashOutline"></ion-icon>
                            <ion-label>Cotisations</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item theme-item">
                            <ion-segment :value="theme" @ionChange="onThemeChange($event)" class="theme-segment">
                                <ion-segment-button value="system">
                                    <ion-label>Système</ion-label>
                                </ion-segment-button>
                                <ion-segment-button value="light">
                                    <ion-label>Clair</ion-label>
                                </ion-segment-button>
                                <ion-segment-button value="dark">
                                    <ion-label>Sombre</ion-label>
                                </ion-segment-button>
                            </ion-segment>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" color="danger" @click="logout()">
                            <ion-icon slot="start" :icon="logInOutline"></ion-icon>
                            <ion-label>Déconnexion</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                </ion-list>
            </ion-content>
        </ion-menu>

        <ion-menu side="end" content-id="main-content" type="overlay">
            <ion-header>
                <ion-toolbar class="app-toolbar gradient-header">
                    <ion-title>Notifications</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-item class="notif-item" detail="false" :button="true" @click="readAll()" lines="none">
                    <ion-label class="notif-label">
                        <div class="title">Tout marquer comme lu</div>
                    </ion-label>
                </ion-item>
                <notification-item v-for="notification in notifications" :key="notification.id"
                    :notification="notification" @click="goToNotification(notification)" />
            </ion-content>
        </ion-menu>

        <ion-content id="main-content">
            <router-view></router-view>
        </ion-content>

        <!-- Tab bar -->
        <ion-tab-bar v-if="this.loggedIn">
            <ion-tab-button tab="feed" ref="feed" href="/feed">
                <ion-icon :icon="newspaper"></ion-icon>
                <ion-label>Actualités</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="documents" ref="documents" href="/documents">
                <ion-icon :icon="folderOpen"></ion-icon>
                <ion-label>Documents</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="agenda" ref="agenda" href="/agenda">
                <ion-icon :icon="calendarNumber"></ion-icon>
                <ion-label>Agenda</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="votes" ref="votes" href="/votes">
                <ion-icon :icon="thumbsUp"></ion-icon>
                <ion-label>Votes</ion-label>
            </ion-tab-button>

        </ion-tab-bar>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonMenu,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
    IonMenuButton,
    IonSegment,
    IonSegmentButton,
    toastController,
    IonImg,
    IonBadge,
    IonButton,
} from "@ionic/vue";
import { mapGetters } from "vuex";
import { notificationsOutline, logInOutline, search, arrowBack, newspaper, folderOpen, thumbsUp, personCircle, calendarNumber, idCard, cashOutline } from "ionicons/icons";
import { FirebaseMessaging, Importance, Visibility } from '@capacitor-firebase/messaging';
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { Badge } from '@capawesome/capacitor-badge';
import { isPlatform } from '@ionic/vue';
import NotificationItem from "./Notifications/Item.vue";
import axios from 'axios';

export default {
    name: "App",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonTitle,
        IonContent,
        IonMenu,
        IonList,
        IonMenuToggle,
        IonItem,
        IonIcon,
        IonLabel,
        IonTabBar,
        IonTabButton,
        IonMenuButton,
        IonImg,
        IonBadge,
        IonButton,
        NotificationItem,
        IonSegment,
        IonSegmentButton,
    },
    computed: {
        ...mapGetters("sessionStore", {
            user: "getUser",
        }),
        ...mapGetters("notificationsStore", {
            notifications: "getNotifications",
        }),
        loggedIn() {
            return this.user.id !== 0;
        },
        unreadNotifications() {
            if (!this.notifications || !Array.isArray(this.notifications)) {
                return 0;
            }
            return this.notifications.filter(notification => !notification.read).length;
        }
    },
    methods: {
        async presentToast(message, color = "success", header = undefined) {
            const toast = await toastController.create({
                header: header,
                message: message,
                duration: 3000,
                cssClass: "custom-toast",
                color: color,
                buttons: [
                    {
                        text: "x",
                        role: "cancel",
                    },
                ],
            });

            await toast.present();
        },
        logout() {
            this.$store.dispatch("sessionStore/logout").then(() => {
                this.presentToast("Vous êtes déconnectés");
                this.$router.go("/login");
            });
        },
        async openEndMenu() {
            const menu = document.querySelector('ion-menu[side="end"]');
            if (menu) {
                await menu.open();
            }
        },
        async closeEndMenu() {
            const menu = document.querySelector('ion-menu[side="end"]');
            if (menu) {
                await menu.close();
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        goToNotification(notification) {
            if (notification.notifiable_type === 'Post') {
                this.$router.push({ name: 'PostsShow', params: { id: notification.notifiable_id } });
            } else if (notification.notifiable_type === 'Event') {
                this.$router.push({ name: 'EventsShow', params: { id: notification.notifiable_id } });
            } else if (notification.notifiable_type === 'VoteCampaign') {
                this.$router.push({ name: 'VoteShow', params: { campaign_id: notification.notifiable_id } });
            }
            this.closeEndMenu();
            // Marquer la notification comme lue
            this.markAsRead(notification);
        },
        routeTo(route) {
            this.$router.push(route);
        },
        async initPushNotifications() {
            // 1. On écoute les rafraîchissements de token AVANT toute autre chose
            try {
                this.tokenListener = await FirebaseMessaging.addListener('tokenReceived', ({ token }) => {
                    this.setPushToken(token);
                });
            } catch (error) {
                // console.error('Impossible d\'écouter les tokens Firebase', error);
            }

            // Notification reçue app ouverte : iOS l'affiche lui-même (presentationOptions),
            // Android non → on l'affiche en toast. Dans les deux cas on rafraîchit la cloche.
            try {
                this.receivedListener = await FirebaseMessaging.addListener('notificationReceived', ({ notification }) => {
                    this.$store.dispatch('notificationsStore/getNotifications');
                    if (isPlatform('android') && (notification.title || notification.body)) {
                        this.presentToast(notification.body || '', 'primary', notification.title);
                    }
                });
            } catch (error) {
                // console.error('Impossible d\'écouter les notifications Firebase', error);
            }

            try {
                // 2. Vérification / demande de la permission (Android 13+ et iOS)
                let permission = await FirebaseMessaging.checkPermissions();
                if (permission.receive !== 'granted' && permission.receive !== 'denied') {
                    permission = await FirebaseMessaging.requestPermissions();
                }
                if (permission.receive !== 'granted') {
                    return;
                }

                // Canal par défaut Android (les notifications envoyées sans channel_id y arrivent)
                if (isPlatform('android')) {
                    await FirebaseMessaging.createChannel({
                        id: 'default',
                        name: 'Notifications',
                        description: 'Notifications ADD+',
                        importance: Importance.High,
                        visibility: Visibility.Public,
                        vibration: true,
                    });
                }

                // 3. On redemande le token à chaque lancement : le localStorage n'est qu'un cache
                const { token } = await FirebaseMessaging.getToken();
                this.setPushToken(token);
            } catch (error) {
                // console.error('Erreur lors de l\'initialisation de Firebase Messaging', error);
            }
        },
        setPushToken(token) {
            if (!token) return;
            this.pushToken = token;
            localStorage.setItem('firebase_token', token);
            this.sendPushToken();
        },
        async sendPushToken() {
            const userId = this.$store.state.sessionStore.user?.id;
            const token = this.pushToken;

            // Pas encore connecté : le watcher sur l'utilisateur relancera l'envoi après le login
            if (!token || !userId) return;

            // Évite de renvoyer le même token pour le même utilisateur dans la session
            const key = `${userId}:${token}`;
            if (this.sentPushKey === key) return;
            this.sentPushKey = key;

            try {
                await this.$store.dispatch('sessionStore/storeDeviceToken', {
                    token: token,
                    user_id: userId,
                    platform: 'mobile',
                });
            } catch (error) {
                // Échec réseau : on réessaiera plus tard
                if (this.sentPushKey === key) {
                    this.sentPushKey = null;
                }
                clearTimeout(this.pushRetryTimeout);
                this.pushRetryTimeout = setTimeout(() => this.sendPushToken(), 30000);
            }
        },
        async markAsRead(notif) {
            let base_url =
                process.env.NODE_ENV === "production"
                    ? "https://app.addfrance.fr"
                    : "http://localhost:3000";
            try {
                await axios.patch(`${base_url}/api/notifications/${notif.id}/mark_as_read`);
                await Badge.decrease();
                this.$store.dispatch('notificationsStore/getNotifications'); // Rafraîchir les notifications
            } catch (error) {
                // console.error('Erreur lors de la mise à jour de la notification', error)
            }
        },
        async readAll() {
            let base_url =
                process.env.NODE_ENV === "production"
                    ? "https://app.addfrance.fr"
                    : "http://localhost:3000";
            try {
                await axios.patch(`${base_url}/api/notifications/mark_all_as_read`);
                await Badge.clear();
                this.$store.dispatch('notificationsStore/getNotifications'); // Rafraîchir les notifications
            } catch (error) {
                // console.error('Erreur lors de la mise à jour des notifications', error)
            }
        },
        ensureSystemListener() {
            if (this.systemMql) return;

            this.systemMql = window.matchMedia('(prefers-color-scheme: dark)');

            this.onSystemThemeChange = (e) => {
                // Ne réagit que si l’utilisateur est en mode system
                if (this.theme !== 'system') return;

                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                this.syncSystemBars(e.matches);
            };

            // Safari iOS ancien: addListener / removeListener
            if (this.systemMql.addEventListener) {
                this.systemMql.addEventListener('change', this.onSystemThemeChange);
            } else {
                this.systemMql.addListener(this.onSystemThemeChange);
            }
        },
        // Edge-to-edge (Android 15+) : les barres système sont transparentes au-dessus de l'app,
        // la couleur des icônes doit donc suivre le thème de l'app (pas seulement celui du téléphone).
        // Dark = icônes claires (fond sombre), Light = icônes sombres (fond clair).
        syncSystemBars(isDark) {
            if (!Capacitor.isNativePlatform()) return;
            SystemBars.setStyle({ style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => {});
        },
        applyTheme(theme) {
            const root = document.documentElement;

            if (theme === 'dark') {
                root.setAttribute('data-theme', 'dark');
                this.syncSystemBars(true);
                return;
            }

            if (theme === 'light') {
                root.setAttribute('data-theme', 'light');
                this.syncSystemBars(false);
                return;
            }

            // theme === 'system'
            this.ensureSystemListener();
            root.setAttribute('data-theme', this.systemMql.matches ? 'dark' : 'light');
            this.syncSystemBars(this.systemMql.matches);
        },
        onThemeChange(ev) {
            const theme = ev.detail.value;
            this.theme = theme;
            localStorage.setItem('theme', theme);
            this.applyTheme(theme);
        },
    },
    data: function () {
        return {
            messageToast: "Test Message",
            showToast: false,
            app_version: "1.3.0",
            refreshInterval: null,
            theme: localStorage.getItem('theme') || 'system',
            systemMql: null,
            onSystemThemeChange: null,
            pushToken: null,
            sentPushKey: null,
            pushRetryTimeout: null,
            tokenListener: null,
            receivedListener: null,
        };
    },
    beforeMount: function () {
        if (null === localStorage.getItem('token')) {
            this.$router.push({ name: 'Login', replace: true });
        }
        this.$store.dispatch('sessionStore/fetchUser');
        this.$store.dispatch('notificationsStore/getNotifications');
    },
    beforeUnmount: function () {
        clearTimeout(this.pushRetryTimeout);
        if (this.tokenListener) {
            this.tokenListener.remove();
            this.tokenListener = null;
        }
        if (this.receivedListener) {
            this.receivedListener.remove();
            this.receivedListener = null;
        }

        if (!this.systemMql || !this.onSystemThemeChange) return;

        if (this.systemMql.removeEventListener) {
            this.systemMql.removeEventListener('change', this.onSystemThemeChange);
        } else {
            this.systemMql.removeListener(this.onSystemThemeChange);
        }
        this.systemMql = null;
        this.onSystemThemeChange = null;
    },
    async mounted() {
        this.applyTheme(this.theme);

        if (Capacitor.isNativePlatform()) {
            // Envoie le token dès qu'un utilisateur est connecté (y compris après un login plus tard)
            this.$watch(
                () => this.$store.state.sessionStore.user?.id,
                () => this.sendPushToken()
            );
            await this.initPushNotifications();
        }
        this.refreshInterval = setInterval(() => {
            this.$store.dispatch('notificationsStore/getNotifications');
        }, 60000); // 60000 ms = 1 minute

        // Demande permission badge
        const permissionResult = await Badge.requestPermissions();

        if (permissionResult.display !== 'granted') return;

        // Initialise le badge à 0 au lancement
        await Badge.clear();
        await Badge.set({ count: this.unreadNotifications });
    },
    setup() {
        return {
            notificationsOutline,
            newspaper,
            logInOutline,
            search,
            arrowBack,
            folderOpen,
            thumbsUp,
            personCircle,
            calendarNumber,
            idCard,
            cashOutline,
        };
    },
};
</script>

<style>
.add-logo {
    display: block;
    margin: 0 auto;
    max-width: 80px;
}

.notification-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 10px;
}

.app-toolbar {
    --border-width: 0;
    --background: var(--ion-background-color);
}

ion-menu-button,
ion-button {
    --color: var(--ion-text-color);
}

.menu-item {
    --background: transparent;
    --border-radius: 12px;
    margin: 4px 8px;
    padding: 6px 8px;
    transition: background 0.2s ease;
}

.menu-item:hover {
    --background: rgba(121, 138, 244, 0.08);
}

ion-menu ion-content {
    --padding-start: 8px;
    --padding-end: 8px;
}

ion-tab-bar {
    --background: var(--ion-card-background);
    border-top: 1px solid var(--ion-color-border);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);
}

ion-tab-button {
    --color: var(--ion-color-step-500);
    --color-selected: var(--ion-color-primary);
}

ion-tab-button.ion-selected ion-icon {
    transform: scale(1.1);
    transition: transform 0.2s ease;
}

.theme-item {
    align-items: center;
}

.theme-segment {
    max-width: 210px;
}

.theme-segment ion-segment-button {
    min-width: 0;
}

.theme-segment ion-label {
    font-size: 12px;
}
</style>