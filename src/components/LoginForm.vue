<template>

    <div class="logo">
    </div>

    <ion-card color="transparent" elevation="0">
        <ion-card-content>

            <ion-item fill="outline">
                <ion-label position="floating">Email</ion-label>
                <ion-input v-model="credential['email']" name="email" type="email" spellcheck="false"
                    autocapitalize="off" required autocomplete="email"></ion-input>
            </ion-item>

            <ion-item fill="outline">
                <ion-label position="floating">Mot de passe</ion-label>
                <ion-input v-model="credential['password']" type="password" label="Password">
                </ion-input>
            </ion-item>

            <ion-button class="ion-margin" shape="round" expand="block" @click="login()">Connexion</ion-button>
        </ion-card-content>
    </ion-card>
</template>

<script>
import { IonLabel, IonInput, IonButton, IonCard, IonCardContent, IonItem } from '@ionic/vue';
import { eye } from 'ionicons/icons';

export default {
    name: "loginComponent",
    components: { IonLabel, IonInput, IonButton, IonCard, IonCardContent, IonItem },
    methods: {
        login: function () {
            this.$store.dispatch('sessionStore/login', this.credential).then(() => {
                this.$root.presentToast('Vous êtes connecté !');
                this.$router.push({ name: 'Feed', replace: true });
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
    setup() {
        return {
            eye
        }
    }
};
</script>

<style scoped>
.logo {
    background-image: url('../../public/assets/addPlus_dark.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 200px;
    margin: 0 auto;
    width: 50%;
}

@media (prefers-color-scheme: dark) {
    .logo {
        background-image: url('../../public/assets/addPlus_light.png');
    }
}

ion-card {
    box-shadow: none;
}

ion-item {
    --background: transparent;
}
</style>