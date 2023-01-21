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

import { mapGetters } from "vuex";
import { sessionStore } from '../store/modules/sessionStore';
import { IonToolbar, IonTitle, IonCardHeader, IonLabel, IonInput, IonItem, IonButton, IonCol, IonRow, IonCardContent, IonCard } from '@ionic/vue';

export default {
    name: "loginComponent",
    components: { IonToolbar, IonTitle, IonCardHeader, IonLabel, IonInput, IonItem, IonButton, IonCol, IonRow, IonCardContent, IonCard },
    computed: {
        ...mapGetters({
            user: 'getUser',
            church: 'getChurch',
            token: 'getToken',
        }),
    },

    methods: {
        login: function () {
            this.$store.dispatch('login', this.credential).then(() => {
                if (null !== this.token) {
                    sessionStorage.setItem('token', this.token);
                    this.$router.push({ name: 'UserShow', replace: true });
                }
            });
        },
    },
    data: function () {
        var credential = {
            email: '',
            password: '',
        };

        return {
            credential: credential,
        }
    },
    mounted: function () {
        if (!this.$store.hasModule('sessionStore')) {
            this.$store.registerModule('sessionStore', sessionStore);
            this.$store.dispatch('sessionStore/getConnectedUser');
        }
        if (null === this.user) {
            this.$router.push({ name: 'UserShow', replace: true });
        }
    },
};
</script>