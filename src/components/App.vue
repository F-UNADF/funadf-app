<template>
    <ion-page>
        <ion-header v-if="loggedIn" class="app-header">
            <ion-toolbar class="app-toolbar">
                <ion-buttons slot="start">
                    <!-- Écran de détail : retour ; écran principal : menu -->
                    <ion-button v-if="isDetailRoute" class="toolbar-icon-btn" aria-label="Retour" @click="goBack()">
                        <ion-icon slot="icon-only" :icon="backIcon" />
                    </ion-button>
                    <ion-menu-button v-else menu="start" aria-label="Ouvrir le menu"></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <img src="/assets/ADD-plus-Bicouleur.svg" alt="ADD+" class="add-logo" />
                </ion-title>
                <ion-buttons slot="end">
                    <ion-button class="toolbar-icon-btn notif-button" :aria-label="notifLabel" @click="openEndMenu()">
                        <span class="bell">
                            <ion-icon :icon="notificationsOutline" aria-hidden="true" />
                            <ion-badge v-if="unreadNotifications > 0" class="notification-badge" aria-hidden="true">
                                {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
                            </ion-badge>
                        </span>
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
                        <ion-item lines="none" class="menu-item" @click="routeTo('/parametres')">
                            <ion-icon slot="start" :icon="settingsOutline"></ion-icon>
                            <ion-label>Paramètres</ion-label>
                        </ion-item>
                        <ion-item lines="none" class="menu-item" color="danger" @click="logout()">
                            <ion-icon slot="start" :icon="logInOutline"></ion-icon>
                            <ion-label>Déconnexion</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                </ion-list>
            </ion-content>
        </ion-menu>

        <ion-menu side="end" menu-id="notifications" content-id="main-content" type="overlay" class="notif-menu">
            <ion-header class="app-header">
                <ion-toolbar class="app-toolbar">
                    <ion-title>Notifications</ion-title>
                    <ion-buttons slot="end">
                        <ion-button class="toolbar-icon-btn" aria-label="Fermer les notifications" @click="closeEndMenu()">
                            <ion-icon slot="icon-only" :icon="closeIcon" />
                        </ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="notif-content">
                <div v-if="unreadNotifications > 0" class="notif-actions">
                    <span class="notif-count">{{ unreadNotifications }} non lue{{ unreadNotifications > 1 ? 's' : '' }}</span>
                    <ion-button fill="clear" size="small" class="read-all" @click="readAll()">Tout marquer comme lu</ion-button>
                </div>
                <ion-list v-if="notificationList.length" class="notif-list" lines="full">
                    <notification-item v-for="notification in notificationList" :key="notification.id"
                        :notification="notification" @click="goToNotification(notification)" />
                </ion-list>
                <screen-state v-else :icon="notificationsOutline" title="Aucune notification"
                    text="Les nouvelles actualités, les événements et les votes vous seront signalés ici." />
            </ion-content>
        </ion-menu>

        <ion-content id="main-content" ref="mainContent">
            <router-view></router-view>
        </ion-content>

        <!-- Barre d'onglets : les 4 destinations principales -->
        <ion-tab-bar v-if="loggedIn" id="app-tab-bar">
            <ion-tab-button tab="feed" ref="feed" href="/feed">
                <ion-icon :icon="newspaper" aria-hidden="true"></ion-icon>
                <ion-label>Actualités</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="documents" ref="documents" href="/documents">
                <ion-icon :icon="folderOpen" aria-hidden="true"></ion-icon>
                <ion-label>Documents</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="agenda" ref="agenda" href="/agenda">
                <ion-icon :icon="calendarNumber" aria-hidden="true"></ion-icon>
                <ion-label>Agenda</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="votes" ref="votes" href="/votes">
                <ion-icon :icon="thumbsUp" aria-hidden="true"></ion-icon>
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
    toastController,
    IonBadge,
    IonButton,
} from "@ionic/vue";
import { close, chevronBack, arrowBack as mdArrowBack } from "ionicons/icons";
import ScreenState from "./Common/ScreenState.vue";

// Écrans de détail : l'en-tête affiche « Retour » au lieu du menu
const DETAIL_ROUTES = ["PostsShow", "EventsShow", "VoteShow", "SearchShow", "UserEdit"];
import { mapGetters } from "vuex";
import { notificationsOutline, logInOutline, search, arrowBack, newspaper, folderOpen, thumbsUp, personCircle, calendarNumber, idCard, cashOutline, settingsOutline } from "ionicons/icons";
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { initTheme } from '@/services/theme';
import { initPush, sendToken as sendPushToken, unregisterOnLogout } from '@/services/push';
import { Badge } from '@capawesome/capacitor-badge';
import { isPlatform } from '@ionic/vue';
import NotificationItem from "./Notifications/Item.vue";
import axios from 'axios';
import { provide, shallowRef } from 'vue';

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
        IonBadge,
        IonButton,
        NotificationItem,
        ScreenState,
    },
    computed: {
        ...mapGetters("sessionStore", {
            user: "getUser",
        }),
        ...mapGetters("notificationsStore", {
            notifications: "getNotifications",
        }),
        loggedIn() {
            return !!this.user && this.user.id !== 0;
        },
        closeIcon() {
            return close;
        },
        isDetailRoute() {
            return DETAIL_ROUTES.includes(this.$route.name);
        },
        backIcon() {
            return isPlatform('ios') ? chevronBack : mdArrowBack;
        },
        notificationList() {
            return Array.isArray(this.notifications) ? this.notifications : [];
        },
        notifLabel() {
            const n = this.unreadNotifications;
            return n > 0 ? `Notifications, ${n} non lue${n > 1 ? 's' : ''}` : 'Notifications';
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
                // au-dessus de la barre d'onglets plutôt que dessous
                positionAnchor: this.loggedIn ? 'app-tab-bar' : undefined,
                swipeGesture: 'vertical',
                buttons: [
                    {
                        icon: close,
                        side: 'end',
                        role: "cancel",
                        htmlAttributes: { 'aria-label': 'Fermer' },
                    },
                ],
            });

            await toast.present();
        },
        async logout() {
            // Le téléphone cesse de recevoir les notifications du compte déconnecté
            await unregisterOnLogout();
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
            // Ouvert depuis une notification sans historique : retour à l'accueil
            if (window.history.state && window.history.state.back) {
                this.$router.back();
            } else {
                this.$router.replace('/feed');
            }
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
            // Notification reçue app ouverte : iOS l'affiche lui-même (presentationOptions),
            // Android non → on l'affiche en toast. Dans les deux cas on rafraîchit la cloche.
            try {
                this.receivedListener = await FirebaseMessaging.addListener('notificationReceived', ({ notification }) => {
                    this.$store.dispatch('notificationsStore/getNotifications').catch(() => {});
                    if (isPlatform('android') && (notification.title || notification.body)) {
                        this.presentToast(notification.body || '', 'primary', notification.title);
                    }
                });
            } catch (error) {
                // console.error('Impossible d\'écouter les notifications Firebase', error);
            }

            // Permission, canal Android et jeton : src/services/push.js
            // (ne fait rien si l'utilisateur a coupé les notifications dans Paramètres).
            await initPush();
        },
        async markAsRead(notif) {
            let base_url =
                process.env.NODE_ENV === "production"
                    ? "https://app.addfrance.fr"
                    : "http://localhost:3000";
            try {
                await axios.patch(`${base_url}/api/notifications/${notif.id}/mark_as_read`);
                await Badge.decrease();
                this.$store.dispatch('notificationsStore/getNotifications').catch(() => {}); // Rafraîchir les notifications
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
                this.$store.dispatch('notificationsStore/getNotifications').catch(() => {}); // Rafraîchir les notifications
            } catch (error) {
                // console.error('Erreur lors de la mise à jour des notifications', error)
            }
        },
    },
    watch: {
        // Un seul ion-content pour tous les écrans : on remonte en haut à chaque changement d'écran
        '$route.path'() {
            const content = this.$refs.mainContent && this.$refs.mainContent.$el;
            if (content && content.scrollToTop) content.scrollToTop(0);
        },
    },
    data: function () {
        return {
            messageToast: "Test Message",
            showToast: false,
            app_version: "1.3.0",
            refreshInterval: null,
            receivedListener: null,
        };
    },
    beforeMount: function () {
        if (null === localStorage.getItem('token')) {
            this.$router.push({ name: 'Login', replace: true });
        }
        this.$store.dispatch('sessionStore/fetchUser');
        this.$store.dispatch('notificationsStore/getNotifications').catch(() => {});
    },
    beforeUnmount: function () {
        if (this.receivedListener) {
            this.receivedListener.remove();
            this.receivedListener = null;
        }
    },
    async mounted() {
        // Thème (Système / Clair / Sombre) : choisi dans Paramètres, voir src/services/theme.js
        initTheme();

        if (Capacitor.isNativePlatform()) {
            // Envoie le token dès qu'un utilisateur est connecté (y compris après un login plus tard)
            this.$watch(
                () => this.$store.state.sessionStore.user?.id,
                () => sendPushToken()
            );
            await this.initPushNotifications();
        }
        this.refreshInterval = setInterval(() => {
            this.$store.dispatch('notificationsStore/getNotifications').catch(() => {});
        }, 60000); // 60000 ms = 1 minute

        // Demande permission badge
        const permissionResult = await Badge.requestPermissions();

        if (permissionResult.display !== 'granted') return;

        // Initialise le badge à 0 au lancement
        await Badge.clear();
        await Badge.set({ count: this.unreadNotifications });
    },
    setup() {
        // Ionic Vue 8 : un ion-tab-bar placé hors d'ion-tabs (notre cas : il est dans la
        // coquille, sous le router-view) attend ces données, normalement fournies par
        // ion-tabs. Sans elles, son montage plante et les boutons ne naviguent plus.
        // hasRouterOutlet: true pour que chaque bouton pousse son href dans le routeur
        // (comportement d'Ionic 6).
        provide('tabBarData', shallowRef({
            hasRouterOutlet: true,
            _tabsWillChange: () => {},
            _tabsDidChange: () => {},
        }));

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
            settingsOutline,
        };
    },
};
</script>

<style>
/* --- En-tête -------------------------------------------------------------- */
.app-header {
    box-shadow: none;
}

/* Filet discret plutôt que l'ombre Material sous l'en-tête */
.app-header::after {
    display: none;
}

.app-toolbar {
    --background: var(--ion-background-color);
    --border-width: 0 0 1px;
    --border-color: var(--app-border);
    --color: var(--app-text);
}

.add-logo {
    display: block;
    height: 28px;
    width: auto;
    margin: 0 auto;
}

/* Boutons d'icône de l'en-tête : couleur du texte, cible de 44 px au moins */
.app-toolbar ion-menu-button,
.app-toolbar .toolbar-icon-btn {
    --color: var(--app-text);
    min-width: 44px;
    min-height: 44px;
}

.bell {
    position: relative;
    display: inline-flex;
}

.bell ion-icon {
    font-size: 24px;
}

.notification-badge {
    position: absolute;
    top: -6px;
    left: 12px;
    min-width: 18px;
    height: 18px;
    padding: 2px 5px;
    border-radius: 999px;
    font-size: 0.6875rem;
    font-weight: 700;
    line-height: 14px;
    --background: var(--ion-color-danger);
    --color: var(--ion-color-danger-contrast);
    /* détache la pastille de la cloche, quel que soit le fond */
    box-shadow: 0 0 0 2px var(--ion-background-color);
}

/* --- Menu latéral --------------------------------------------------------- */
.menu-item {
    --background: transparent;
    --border-radius: 12px;
    --min-height: 48px;
    margin: 2px 8px;
}

.menu-item ion-icon[slot="start"] {
    color: var(--ion-color-primary);
}

.menu-item.ion-color-danger ion-icon[slot="start"] {
    color: inherit;
}

ion-menu ion-content {
    --padding-start: 0;
    --padding-end: 0;
}

/* --- Panneau des notifications ------------------------------------------- */
.notif-content {
    --background: var(--ion-background-color);
}

.notif-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 8px 4px 16px;
}

.notif-count {
    font-size: 0.875rem;
    color: var(--app-text-muted);
}

.read-all {
    min-height: 44px;
    margin: 0;
    font-weight: 600;
}

.notif-list {
    padding: 0;
    background: transparent;
}

/* --- Barre d'onglets ------------------------------------------------------- */
ion-tab-bar {
    --background: var(--ion-tab-bar-background);
    --border: 1px solid var(--app-border);
}

ion-tab-button {
    --color: var(--app-text-muted);
    --color-selected: var(--ion-color-primary);
    min-height: 52px;
}

ion-tab-button ion-label {
    font-size: 0.75rem;
    font-weight: 600;
}

/* --- Toasts --------------------------------------------------------------- */
ion-toast.custom-toast {
    --border-radius: var(--app-radius-control);
    --max-width: 560px;
}
</style>
