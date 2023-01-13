<template>
    <ion-card>
        <ion-card-header>
            <ion-toolbar>
                <ion-title>Connexion</ion-title>
            </ion-toolbar>
        </ion-card-header>
        <ion-card-content>
            <ion-item>
                <ion-label position="stacked" color="primary">Email</ion-label>
                <ion-input v-model="credential['email']" name="email" type="email" spellcheck="false"
                    autocapitalize="off" required></ion-input>
            </ion-item>

            <ion-item>
                <ion-label position="stacked" color="primary">Mot de passe</ion-label>
                <ion-input v-model="credential['password']" name="password" type="password" required></ion-input>
            </ion-item>


            <ion-row responsive-sm>
                <ion-col>
                    <ion-button expand="block" @click="login()">Login</ion-button>
                </ion-col>
            </ion-row>
        </ion-card-content>
    </ion-card>
</template>

<script>
import { IonToolbar, IonTitle, IonCardHeader, IonLabel, IonInput, IonItem, IonButton, IonCol, IonRow, IonCardContent, IonCard } from '@ionic/vue';
import SessionStore from '../store/modules/sessionStore'

export default {
    name: "loginComponent",
    components: { IonToolbar, IonTitle, IonCardHeader, IonLabel, IonInput, IonItem, IonButton, IonCol, IonRow, IonCardContent, IonCard },

    methods: {
        login: function () {
            this.$store.dispatch('SessionStore/login', this.credential).then(() => {
                this.$root.presentToast("Féliciations ! Vous êtes connectés.");
                window.location.href = '/user';
            });
        },
    },
    data: function() {
        var credential = {
            email: 'mon@email.com',
            password: 'MonMotDePassSecurisé',
        };

        return {
            credential: credential,
        }
    },
    mounted: function () {
        if (!this.$store.hasModule('SessionStore')) {
            this.$store.registerModule('SessionStore', SessionStore);
        }
    }
};
</script>