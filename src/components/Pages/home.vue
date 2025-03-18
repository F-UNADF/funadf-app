<template>
    <ion-page>
        <ion-content>
            <user-show :user="this.user" :church="this.currentChurch" :canEdit="true"></user-show>
        </ion-content>
    </ion-page>
</template>

<script>

import { mapGetters } from "vuex";
import UserShow from '@/components/Users/show.vue';
import { IonContent } from '@ionic/vue';

export default {
    name: "HomePage",
    components: { UserShow, IonContent },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
        }),
        ...mapGetters('profilStore', {
            profile: 'getProfile',
            gratitudes: 'getGratitudes',
            roles: 'getRoles',
            phases: 'getPhases',
            presidencies: 'getPresidences',
            fees: 'getFees',
        }),
        currentChurch() {
            // on recupere léglise courante en se basant sur phases, la plus recente n'avant pas de end_at
            return this.phases.filter(phase => phase.end_at === null)[0];
        },
    },
    beforeCreate: function () {
        if (null === localStorage.getItem('token')) {
            this.$router.push('/login');
        }
        this.$store.dispatch('sessionStore/fetchUser');
        this.$store.dispatch('profilStore/getProfile');
    },
};
</script>

<style scoped></style>