<template>
    <ion-card color="primary">
        <ion-card-header>
            <div class="avatar">
                <img :src=user.avatar alt="Avatar User">
            </div>
            <ion-card-title>{{ user.fullname }}</ion-card-title>
            <ion-chip>
                <i class="material-icons mr-3">account_box</i>
                <ion-label>{{ user.id }}</ion-label>
            </ion-chip>
            <ion-chip><i class="material-icons mr-3">bookmark</i>
                <ion-label>{{ user.level }}</ion-label>
            </ion-chip>
        </ion-card-header>
        <ion-card-content>
            <ion-list lines="full">
                <ion-item color="primary" v-if="!!user.email">
                    <i class="material-icons mr-3">mail</i>
                    <a href="mailto: {{ user.email }}" color="light">{{ user.email }}</a>
                </ion-item>
                <ion-item color="primary" v-if="!!user.phone">
                    <i class="material-icons mr-3">phone</i>
                    <a href="tel: {{ user.phone }}">{{ user.phone }}</a>
                </ion-item>
                <ion-item color="primary" v-if="!!user.town">
                    <i class="material-icons mr-3">location_on</i>
                    {{ user.town }}
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>

    <ion-card color="secondary" v-if="!!church">
        <!-- STRUCUTRE -->
        <ion-card-header>
            <ion-card-title>{{ church.name }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-list lines="full">
                <ion-item color="secondary">
                    <i class="material-icons mr-3">location_on</i>
                    {{ church.zipcode }} {{ church.town }}
                </ion-item>
                <ion-item v-if="(church.email)">
                    <ion-label class="sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated"><a
                            href="mailto: {{ church.email }}">{{ church.email }}</a></ion-label>
                </ion-item>
                <ion-item v-if="(church.phone)">
                    <ion-label><a href="tel: {{ church.phone }}">{{ church.phone }}</a></ion-label>
                </ion-item>
            </ion-list>
        </ion-card-content>
    </ion-card>
</template>

<script>

import { mapGetters } from "vuex";
import { IonCard, IonCardTitle, IonList, IonCardContent, IonChip, IonCardHeader, IonLabel, IonItem } from '@ionic/vue';

export default {
    name: "UserShowComponent",
    components: { IonCard, IonCardTitle, IonList, IonCardContent, IonChip, IonCardHeader, IonLabel, IonItem },
    computed: {
        ...mapGetters({
            user: 'getUser',
            church: 'getChurch',
        }),
    },
    beforeCreate: function () {
        this.$store.dispatch('getConnectedUser');

        if (null === sessionStorage.getItem('token') || null === this.user) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
};
</script>

<style scoped>
.avatar img {
    display: block;
    width: 75%;
    margin: 0 auto 30px;
    border-radius: 100%;
    overflow: hidden;
    padding: 0;
}

a {
    color: #fff;
    text-decoration: none;
}

.mr-3 {
    margin-right: 10px;
}
</style>