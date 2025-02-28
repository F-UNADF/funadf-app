<template>
    <ion-card>
        <ion-card-content>
            <ion-item>
                <ion-label position="stacked" color="primary">Email</ion-label>
                <ion-input v-model="credential['email']" name="email" type="email" spellcheck="false"
                    autocapitalize="off" required autocomplete="email"></ion-input>
            </ion-item>

            <ion-item>
                <ion-label position="stacked" color="primary">Mot de passe</ion-label>
                <ion-input v-model="credential['password']" name="password" :type="showPassword ? 'text' : 'password'"
                    required :show-password="showPassword" autocomplete="current-password">
                </ion-input>
                <i class="material-icons visibilityIcon" @click="togglePassword()">
                    {{ showPassword ? 'visibility_off' :
                        'visibility' }}
                </i>
            </ion-item>

            <ion-row responsive-sm>
                <ion-col>
                    <ion-button expand="block" @click="login()">Connexion</ion-button>
                </ion-col>
            </ion-row>
        </ion-card-content>
    </ion-card>
</template>

<script>
import { IonLabel, IonInput, IonItem, IonButton, IonCol, IonRow, IonCardContent, IonCard } from '@ionic/vue';

export default {
    name: "loginComponent",
    components: { IonLabel, IonInput, IonItem, IonButton, IonCol, IonRow, IonCardContent, IonCard },
    methods: {
        login: function () {
            this.$store.dispatch('sessionStore/login', this.credential).then(() => {
                this.$root.presentToast('Vous êtes connecté !');
                this.$router.push({ name: 'Home', replace: true });
            }, () => {
                this.$root.presentToast('Merci de vérifier vos informations !', "danger");
            });
        },
        togglePassword: function () {
            this.showPassword = !this.showPassword;
        },
    },
    data: function () {
        var credential = {
            email: '',
            password: '',
        };

        return {
            credential: credential,
            showPassword: false,
        }
    },
    beforeCreate: function () {
        if (null !== localStorage.getItem('token')) {
            this.$router.push({ name: 'user', replace: true });
        }
    },
};
</script>

<style>
.visibilityIcon {
    position: absolute;
    right: 15px;
    top: 10px;

}
</style>