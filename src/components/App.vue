<template>
    <ion-page>
        <ion-header v-if="loggedIn">
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <ion-img src="/assets/addPlus_light.png" class="add-logo"></ion-img>
                </ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="openEndMenu()">
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
                        <ion-item @click="routeTo('/user')">
                            <ion-icon slot="start" :icon="personCircle"></ion-icon>
                            <ion-label>Mon profil</ion-label>
                        </ion-item>
                        <ion-item @click="routeTo('/carte')">
                            <ion-icon slot="start" :icon="idCard"></ion-icon>
                            <ion-label>Ma carte pastorale</ion-label>
                        </ion-item>
                        <ion-item @click="routeTo('/annuaire')">
                            <ion-icon slot="start" :icon="search"></ion-icon>
                            <ion-label>Annuaire</ion-label>
                        </ion-item>
                        <ion-item @click="routeTo('/feed')">
                            <ion-icon slot="start" :icon="newspaper"></ion-icon>
                            <ion-label>Actualités</ion-label>
                        </ion-item>
                        <ion-item @click="routeTo('/documents')">
                            <ion-icon slot="start" :icon="folderOpen"></ion-icon>
                            <ion-label>Documents</ion-label>
                        </ion-item>
                        <ion-item @click="routeTo('/agenda')">
                            <ion-icon slot="start" :icon="calendarNumber"></ion-icon>
                            <ion-label>Agenda</ion-label>
                        </ion-item>
                        <ion-item @click="routeTo('/votes')">
                            <ion-icon slot="start" :icon="thumbsUp"></ion-icon>
                            <ion-label>Votes</ion-label>
                        </ion-item>
                        <ion-item color="danger" @click="logout()">
                            <ion-icon slot="start" :icon="logInOutline"></ion-icon>
                            <ion-label>Déconnexion</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                </ion-list>
            </ion-content>
        </ion-menu>

        <ion-menu side="end" content-id="main-content" type="overlay">
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title>Notifications</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <notification-item v-for="notification in notifications" :key="notification.id"
                    :notification="notification" @click="goToNotification(notification)" />
            </ion-content>
        </ion-menu>

        <ion-content id="main-content">
            <router-view></router-view>
        </ion-content>

        <!-- Tab bar -->
        <ion-tab-bar color="primary" v-if="this.loggedIn">
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
    toastController,
    IonImg,
    IonBadge,
    IonButton,
} from "@ionic/vue";
import { mapGetters } from "vuex";
import { notificationsOutline, logInOutline, search, arrowBack, newspaper, folderOpen, thumbsUp, personCircle, calendarNumber, idCard } from "ionicons/icons";
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
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
        async presentToast(message, color = "success") {
            const toast = await toastController.create({
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
            } else {
                console.error("Menu de droite non trouvé");
            }
        },
        async closeEndMenu() {
            const menu = document.querySelector('ion-menu[side="end"]');
            if (menu) {
                await menu.close();
            } else {
                console.error("Menu de droite non trouvé");
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
                this.$router.push({ name: 'VotesShow', params: { campaign_id: notification.notifiable_id } });
            }
            this.closeEndMenu();
            // Marquer la notification comme lue
            this.markAsRead(notification);
        },
        routeTo(route) {
            this.$router.push(route);
        },
        async initFirebaseToken() {
            const localToken = localStorage.getItem('firebase_token');
            if (localToken) {
                console.log('Token déjà récupéré localement.');
                this.waitForUserAndSendToken(localToken);
                return;
            }

            try {
                const permission = await FirebaseMessaging.requestPermissions();
                if (permission.receive === 'granted') {
                    const { token } = await FirebaseMessaging.getToken();

                    if (token) {
                        localStorage.setItem('firebase_token', token);
                        console.log('Token récupéré et sauvegardé localement');
                        this.waitForUserAndSendToken(token);
                    }
                }
            } catch (err) {
                console.error('Erreur lors de la récupération du token :', err);
            }
        },
        waitForUserAndSendToken(token, retries = 20) {
            const userId = this.$store.state.sessionStore.user?.id;

            if (userId) {
                const payload = {
                    token: token,
                    user_id: userId,
                    platform: 'mobile',
                };
                this.$store.dispatch('sessionStore/storeDeviceToken', payload);
                console.log('Token envoyé au backend');
            } else if (retries > 0) {
                console.log('En attente de user.id...');
                setTimeout(() => this.waitForUserAndSendToken(token, retries - 1), 1000);
            } else {
                console.warn('user.id toujours non disponible après plusieurs tentatives');
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
                console.error('Erreur lors de la mise à jour de la notification', error)
            }
        },
    },
    data: function () {
        return {
            messageToast: "Test Message",
            showToast: false,
            app_version: "1.3.0",
            refreshInterval: null,
        };
    },
    beforeMount: function () {
        if (null === localStorage.getItem('token')) {
            this.$router.push({ name: 'Login', replace: true });
        }
        this.$store.dispatch('sessionStore/fetchUser');
        this.$store.dispatch('notificationsStore/getNotifications');
    },
    async mounted() {
        if (isPlatform('ios')) {
            await this.initFirebaseToken();
            FirebaseMessaging.onTokenRefresh(({ token }) => {
                localStorage.setItem('firebase_token', token);
                this.waitForUserAndSendToken(token);
            });
        }
        this.refreshInterval = setInterval(() => {
            this.$store.dispatch('notificationsStore/getNotifications');
        }, 60000); // 60000 ms = 1 minute

        // Demande permission badge
        const permissionResult = await Badge.requestPermissions();

        if (permissionResult.display !== 'granted') return;

        console.log('Permission pour les badges accordée');
        // Initialise le badge à 0 au lancement
        await Badge.clear();
        await Badge.set({ count: this.unreadNotifications });
    },
    setup() {
        return { notificationsOutline, newspaper, logInOutline, search, arrowBack, folderOpen, thumbsUp, personCircle, calendarNumber, idCard };
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
    right: -2px;
    font-size: 0.6rem;
    border-radius: 50%;
}
</style>