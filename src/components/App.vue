<template>
    <ion-app>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>UNADF</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <router-view></router-view>
        </ion-content>

        <!-- Tab bar -->
        <ion-tabs v-if="userIsLoggedIn">
            <ion-tab-bar>
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
        </ion-tabs>
    </ion-app>
</template>

<script>

import { IonTabBar, IonTabButton, IonApp, IonHeader, IonToolbar, IonTitle, toastController } from '@ionic/vue';
import { mapGetters } from "vuex";

export default ({
    name: 'App',
    components: { IonTabBar, IonTabButton, IonApp, IonHeader, IonToolbar, IonTitle },
    computed: {
        ...mapGetters({
            user: 'getUser',
            loggedIn: 'getLoggedIn',
        }),
        userIsLoggedIn: function () {
            return true === this.loggedIn;
        }

    },

    methods: {
        async presentToast(message) {
            const toast = await toastController.create({
                message: message,
                duration: 3000,
                cssClass: 'custom-toast',
                color: 'danger',
                buttons: [
                    {
                        text: 'x',
                        role: 'cancel'
                    }
                ],
            });

            await toast.present();
        },
    },

    data: function () {
        return {
            messageToast: "Test Message",
            showToast: false,
        }
    },
});
</script>
