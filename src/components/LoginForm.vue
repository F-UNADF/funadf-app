<template>
    <v-card class="mx-3 pa-5 pb-8 mt-3">
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Email</div>
        <v-text-field placeholder="Email" prepend-inner-icon="mdi-email-outline" v-model="credential.email"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Mot de passe
            <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
                J'ai oublié mont mot de passe ?</a>
        </div>

        <v-text-field :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'" placeholder="Votre mot de passe"
            prepend-inner-icon="mdi-lock-outline" @click:append-inner="showPassword = !showPassword"
            v-model="credential.password"></v-text-field>

        <v-btn block class="mb-8" color="primary" size="large" @click="login">
            Connexion
        </v-btn>
    </v-card>
</template>

<script>

import { mapGetters } from "vuex";

export default {
    name: "loginComponent",
    components: {},
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
                    localStorage.setItem('token', this.token);
                    this.$root.presentToast('Vous êtes connecté !');
                    this.$router.push({ name: 'UserShow', replace: true });
                }
            }, (error) => {
                console.log(error);
                this.$root.presentToast('Merci de vérifier vos informations !', "danger");
            });
        },
        togglePassword: function () {
            this.showPassword = !this.showPassword;
        },
    },
    data: function () {
        let credential = {
            email: '',
            password: '',
        };
        return {
            credential: credential,
            showPassword: false,
        }
    },
    beforeCreate: function () {
        this.$store.dispatch('getConnectedUser');
        if (null !== localStorage.getItem('token')) {
            this.$router.push({ name: 'UserShow', replace: true });
        }
    },
};
</script>
