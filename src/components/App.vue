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
        <ion-tabs>
            <ion-tab-bar>
                <ion-tab-button ref="profil" tab="profil" href="/user">
                    <i class="material-icons">face</i>
                    <ion-label>Mon profil</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="contact" ref="contact" href="/carte">
                    <i class="material-icons">account_box</i>
                    <ion-label>Ma carte pastorale</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="votes" ref="votes" href="/votes">
                    <i class="material-icons">thumb_up</i>
                    <ion-label>Mes votes</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-app>
</template>

<script>

import { IonTabBar, IonTabButton, IonApp, IonHeader, IonToolbar, IonTitle, toastController } from '@ionic/vue';
import { mapGetters } from "vuex";
import sessionStore from '../store/modules/sessionStore'

export default ({
    name: 'App',
    components: { IonTabBar, IonTabButton, IonApp, IonHeader, IonToolbar, IonTitle },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
        }),
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
    mounted: function () {
        if (!this.$store.hasModule('sessionStore')) {
            this.$store.registerModule('sessionStore', sessionStore);
        }
    }

});
</script>
