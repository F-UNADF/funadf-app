<template>
    <ion-app>
        <ion-router-outlet id="main-content"></ion-router-outlet>
        <side-menu></side-menu>
        <top-header></top-header>
    </ion-app>
</template>

<script>
import { mapGetters } from "vuex";
import { logInOutline, search, arrowBack } from "ionicons/icons";
import { toastController } from "@ionic/vue";
import SideMenu from "@/components/SideMenu.vue";
import TopHeader from "@/components/TopHeader.vue";

export default {
    name: "App",
    components: { SideMenu, TopHeader },
    setup() {
        return { logInOutline, search, arrowBack };
    },
    computed: {
        ...mapGetters("sessionStore", {
            user: "getUser",
        }),
        loggedIn() {
            return this.user && this.user.id !== 0;
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
                localStorage.removeItem("token"); // Supprime le token
                this.presentToast("Vous êtes déconnecté");
                this.$router.push("/login");
            });
        },
        goBack() {
            this.$router.push(-1);
        },
        routeTo(route) {
            this.$router.push(route);
        },
    },
    data: function () {
        return {
            messageToast: "Test Message",
            showToast: false,
            app_version: "1.3.0",
        };
    },
    created: function () {
        if (!this.user) {  // Vérifie si l'utilisateur est déjà défini
            this.$store.dispatch("sessionStore/fetchUser");
        }
        if (!localStorage.getItem('token') && !this.loggedIn) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
};
</script>

<style>
.add-logo {
    display: block;
    margin: 0 auto;
    max-width: 80px;
}
</style>