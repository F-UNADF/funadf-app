<template>
    <ion-app>
        <ion-menu v-if="userIsLoggedIn" type="push" side="end" ref="side-menu" content-id="main-content">
            <ion-header>
                <ion-toolbar>
                    <ion-title>Menu</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-menu-toggle>
                        <ion-item @click="routeTo('annuaire')">
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

        <ion-header>
            <ion-toolbar color="primary">
                <ion-title class="title">
                    <div class="logo">
                        <img class="add-logo" src="/assets/logo-add.png" alt="Logo UNADF">
                        <span>UNADF</span>
                        <img class="unadf-logo" src="/assets/logo-unadf.png" alt="Logo UNADF">
                    </div>
                </ion-title>

                <ion-buttons slot="start">
                    <ion-button v-if="hasHistory" @click="goBack()">
                        <i class="material-icons">arrow_back</i>
                    </ion-button>
                </ion-buttons>


                <ion-buttons slot="end">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content id="main-content">
            <router-view></router-view>
        </ion-content>

        <!-- Tab bar -->
        <ion-tab-bar color="primary" v-if="this.loggedIn">
            <ion-tab-button ref="profil" tab="profil" href="/user">
                <i class="material-icons">face</i>
                <ion-label>Profil</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="contact" ref="contact" href="/carte">
                <i class="material-icons">account_box</i>
                <ion-label>Carte</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="votes" ref="votes" href="/votes">
                <i class="material-icons">thumb_up</i>
                <ion-label>Votes</ion-label>
            </ion-tab-button>
        </ion-tab-bar>
    </ion-app>
</template>

<script>

import { IonIcon, IonContent, IonTabBar, IonButtons, IonButton, IonTabButton, IonApp, IonHeader, IonToolbar, IonTitle, toastController, IonLabel } from '@ionic/vue';
import { mapGetters } from "vuex";
import { logInOutline, search } from 'ionicons/icons';

export default ({
    name: 'App',
    components: { IonIcon, IonContent, IonTabBar, IonTabButton, IonApp, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonLabel },
    setup() {
        return { logInOutline, search };
    },
    computed: {
        ...mapGetters({
            user: 'getUser',
            loggedIn: 'getLoggedIn',
        }),
        userIsLoggedIn: function () {
            return true === this.loggedIn;
        },
        hasHistory() { return window.history.length > 2 },
    },

    methods: {
        async presentToast(message, color = 'success') {
            const toast = await toastController.create({
                message: message,
                duration: 3000,
                cssClass: 'custom-toast',
                color: color,
                buttons: [
                    {
                        text: 'x',
                        role: 'cancel'
                    }
                ],
            });

            await toast.present();
        },
        logout() {
            this.$store.dispatch('logout');
            this.presentToast('Vous êtes déconnectés');
            this.$router.push('/login');
        },
        goBack() {
            this.$router.go(-1);
        },
        onSwipe(event) {
            console.log(event);
            // Check if the swipe is from the left
            if (event.detail.direction === 'x' && event.detail.startX <= 50) {
                this.goBack();
            }
        },
        routeTo(route) {
            this.$router.push(route);
            this.menu.close();
        }
    },

    data: function () {
        return {
            messageToast: "Test Message",
            showToast: false,
            app_version: '0.0.0',
        }
    },
});
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