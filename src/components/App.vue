<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-buttons slot="start" v-if="loggedIn">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>
                    <ion-img src="/assets/logo-add.png" class="add-logo"></ion-img>
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-menu side="start" content-id="main-content">
            <ion-header>
                <ion-toolbar>
                    <ion-title>Menu</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-menu-toggle>
                        <ion-item @click="routeTo('/annuaire')">
                            <ion-icon slot="start" :icon="search"></ion-icon>
                            <ion-label>Annuaire</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                </ion-list>
            </ion-content>
            <ion-footer>
                <ion-note color="medium" class="ion-padding-vertical ion-padding-horizontal">
                    Version : {{ app_version }}
                </ion-note>
                <ion-list>
                    <ion-item color="danger" @click="logout()">
                        <ion-icon slot="start" :icon="logInOutline"></ion-icon>
                        <ion-label>Déconnexion</ion-label>
                    </ion-item>
                </ion-list>
            </ion-footer>
        </ion-menu>

        <ion-content id="main-content">
            <router-view></router-view>
        </ion-content>

        <!-- Tab bar -->
        <ion-tab-bar color="primary" v-if="this.loggedIn">
            <ion-tab-button ref="profil" tab="profil" href="/user">
                <i class="material-icons">face</i>
                <ion-label>Profil</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="documents" ref="documents" href="/documents">
                <i class="material-icons">folder</i>
                <ion-label>Documents</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="feed" ref="feed" href="/feed">
                <i class="material-icons">rss_feed</i>
                <ion-label>Actualités</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="votes" ref="votes" href="/votes">
                <i class="material-icons">thumb_up</i>
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
    IonNote,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonMenuButton,
    toastController,
    IonImg
} from "@ionic/vue";
import { mapGetters } from "vuex";
import { logInOutline, search, arrowBack } from "ionicons/icons";

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
        IonNote,
        IonFooter,
        IonTabBar,
        IonTabButton,
        IonMenuButton,
        IonImg,
    },
    setup() {
        return { logInOutline, search, arrowBack };
    },
    computed: {
        ...mapGetters("sessionStore", {
            user: "getUser",
        }),
        loggedIn() {
            return localStorage.getItem('token') !== null;
        },
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
        goBack() {
            this.$router.go(-1);
        },
        routeTo(route) {
            this.$router.push(route);
        },
    },
    data: function () {
        return {
            messageToast: "Test Message",
            showToast: false,
            app_version: "1.3.0",
        };
    },
    beforeCreate: function () {
        if (null === localStorage.getItem('token')) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
};
</script>

<style>
.add-logo {
    display: block;
    margin: 0 auto;
    max-width: 80px;
}
</style>