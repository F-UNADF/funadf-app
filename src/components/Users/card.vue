<template>
    <ion-card>
        <ion-card-content>
            <ion-text>
                <h3 class="display-3">Carte Pastorale<br>des Assemblées de Dieu</h3>
            </ion-text>

            <ion-row class="ion-justify-content-center">
                <ion-col v-for="(year, index) in years" :key="index">
                    <ion-chip :color="getChipColor(year)">
                        <ion-icon :icon="getChipIcon(year)"></ion-icon>
                        <ion-label>{{ year }}</ion-label>
                    </ion-chip>
                </ion-col>
            </ion-row>

        </ion-card-content>
        <ion-card-header style="text-align: center;">
            <img :src=getAvatar alt="Avatar User"
                style="max-width: 200px; border-radius: 50%; margin: 10px auto 30px; display: block;">

            <ion-card-title class="ion-text-center ion-margin-bottom">
                {{ user.lastname }} {{ user.firstname }}
            </ion-card-title>


            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col size="6">
                        <ion-chip color="light">
                            <ion-icon :icon="idCard"></ion-icon>
                            <ion-label>{{ getUserId(user.id) }}</ion-label>
                        </ion-chip>
                    </ion-col>
                    <ion-col size="6">
                        <ion-chip color="light">
                            <ion-icon :icon="bookmark"></ion-icon>
                            <ion-label>{{ user.level }}</ion-label>
                        </ion-chip>
                    </ion-col>
                </ion-row>
            </ion-grid>

        </ion-card-header>
    </ion-card>
</template>

<script>

import { mapGetters } from "vuex";
import { IonCard, IonCardContent, IonCardHeader, IonChip, IonLabel, IonText, IonCol, IonRow, IonCardTitle } from '@ionic/vue';
import { bookmark, checkmark, close, idCard } from 'ionicons/icons';

export default {
    name: "UserCardComponent",
    components: { IonCard, IonCardContent, IonCardHeader, IonChip, IonLabel, IonText, IonCol, IonRow, IonCardTitle },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
            token: 'getToken',
        }),
        ...mapGetters('profilStore', {
            profile: 'getProfile',
            gratitudes: 'getGratitudes',
            roles: 'getRoles',
            phases: 'getPhases',
            presidencies: 'getPresidences',
            fees: 'getFees',
        }),
        getAvatar() {
            let base_url =
                process.env.NODE_ENV === "production"
                    ? "https://add-fnadf.fr"
                    : "http://app.localhost:3000";
            return base_url + '/avatars/' + this.user.id + '.png' + '?cache=' + new Date().getTime();
        },
    },
    methods: {
        getUserId(id) {
            return id.toString().padStart(5, '0');
        },
        hasFeeForYear(year) {
            return this.fees.filter(fee => fee.what === year.toString()).length > 0;
        },
        getChipColor(year) {
            return this.hasFeeForYear(year) ? 'success' : 'danger';
        },
        getChipIcon(year) {
            return this.hasFeeForYear(year) ? checkmark : close;
        },
        level() {
            if (this.user && !this.gratitudes) {
                return 'N/A';
            }
            const gratitudes = this.gratitudes;
            if (gratitudes.length === 0) {
                return 'N/A';
            }

            // Finding the max start_at gratitude
            const maxStartAt = gratitudes.reduce((max, gratitude) => {
                return gratitude.start_at > max ? gratitude.start_at : max;
            }, gratitudes[0].start_at);

            // Finding the level corresponding to the max start_at gratitude
            const maxStartAtGratitude = gratitudes.find(gratitude => gratitude.start_at === maxStartAt);
            return maxStartAtGratitude ? maxStartAtGratitude.level : 'N/A';
        }
    },
    beforeCreate: function () {
        if (null === localStorage.getItem('token')) {
            this.$router.push({ name: 'Login', replace: true });
        }
        this.$store.dispatch('sessionStore/fetchUser');
        this.$store.dispatch('profilStore/getProfile');
    },
    data() {
        let years = [];
        let currentYear = new Date().getFullYear();
        for (let i = 0; i < 6; i++) {
            years.push(currentYear - i);
        }
        return {
            years: years,
        }
    },
    setup() {
        return { checkmark, close, idCard, bookmark };
    }
};
</script>

<style scoped>
.qrcode {
    max-width: 100%;
    margin: 10px auto;
    display: block;
}

h3 {
    text-align: center;
    font-size: x-large;
    margin-bottom: 30px;
}
</style>