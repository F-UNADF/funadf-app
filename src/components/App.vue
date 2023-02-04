<template>
    <ion-app class="light">
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title class="title">
                    <div class="logo">
                        <img class="add-logo" src="/assets/logo-add.png" alt="Logo UNADF">
                        <span>UNADF</span>
                        <img class="unadf-logo" src="/assets/logo-unadf.png" alt="Logo UNADF">
                    </div>
                </ion-title>
                <ion-buttons slot="end">
                    <ion-button v-if="userIsLoggedIn" @click="logout()">
                        <i class="material-icons">cancel</i>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <router-view></router-view>
        </ion-content>

        <!-- Tab bar -->
        <ion-tabs v-if="userIsLoggedIn">
            <ion-tab-bar color="primary">
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
                color: 'success',
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
        }
    },

    data: function () {
        return {
            messageToast: "Test Message",
            showToast: false,
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