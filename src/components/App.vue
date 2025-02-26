<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button text="" default-href="/carte"></ion-back-button>
                </ion-buttons>
                <ion-title class="title">
                    <div class="logo">
                        <img class="add-logo" src="/assets/logo-add.png" alt="Logo UNADF" />
                        <span>UNADF</span>
                        <img class="unadf-logo" src="/assets/logo-unadf.png" alt="Logo UNADF" />
                    </div>
                </ion-title>
                <ion-buttons slot="end" v-if="loggedIn">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-menu side="end" content-id="main-content">
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
        <ion-tab-bar color="primary" v-if="this.loggedIn === true">
            <ion-tab-button ref="profil" tab="profil" href="/user">
                <i class="material-icons">face</i>
                <ion-label>Profil</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="contact" ref="contact" href="/carte">
                <i class="material-icons">account_box</i>
                <ion-label>Carte</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="feed" ref="feed" href="/feed">
                <i class="material-icons">rss_feed</i>
                <ion-label>Feed</ion-label>
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
    IonBackButton,
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
        IonBackButton,
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
    },
    setup() {
        return { logInOutline, search, arrowBack };
    },
    computed: {
        ...mapGetters("sessionStore", {
            user: "getUser",
        }),
        hasHistory() {
            return window.history.length > 2;
        },
    },
    watch: {
        user: function (value) {
            if (value) {
                this.loggedIn = true;
            }
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
            loggedIn: false,
            app_version: "1.2.2",
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
.logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    flex-direction: row;
}

.unadf-logo {
    height: 40px;
    display: inline-block;
}

.add-logo {
    max-width: 50px;
    display: inline-block;
}
</style>