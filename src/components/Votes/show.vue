<template>
    <h1>Développement en cours</h1>
</template>

<script>

import {mapGetters} from "vuex";
import sessionStore from "@/store/modules/sessionStore";

export default {
    name: "UserShowComponent",
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
        }),
    },
    beforeCreate: function () {
        if (!this.$store.hasModule('sessionStore')) {
            this.$store.registerModule('sessionStore', sessionStore);
            this.$store.dispatch('sessionStore/getConnectedUser');
        }
    },
};
</script>
