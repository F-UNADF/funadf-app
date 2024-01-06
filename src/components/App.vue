<template>
    <v-app>
        <TopBar :user="this.user" />

        <v-main class="bg-blue-lighten-5">
            <router-view></router-view>
        </v-main>

        <BottomBar />

        <SnackBar :text="snackbar.text" :color="snackbar.color" :show="snackbar.show" />
    </v-app>
</template>

<script>

import { mapGetters } from "vuex";
import TopBar from "./Layouts/TopBar.vue";
import BottomBar from "./Layouts/BottomBar.vue";
import SnackBar from "./Tools/SnackBar.vue";

export default ({
    name: 'App',
    components: { TopBar, BottomBar, SnackBar },
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
            this.snackbar.text = message;
            this.snackbar.color = color;
            this.snackbar.show = true;
        },
        logout() {
            this.$store.dispatch('logout');
            this.presentToast('Vous êtes déconnectés');
            this.$router.push('/login');
        },
        goBack() {
            this.$router.go(-1);
        },
    },

    data: function () {
        return {
            snackbar: {
                text: '',
                color: '',
                show: false,
            }
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