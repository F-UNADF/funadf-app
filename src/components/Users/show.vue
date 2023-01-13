<template>
    <ion-card>
        <ion-card-header>
            <div class="avatar">
                <img :src=user.avatar alt="Avatar User">
            </div>
            <ion-card-subtitle><ion-icon name="card-outline"></ion-icon> {{ user.id }}</ion-card-subtitle>
            <ion-card-title>{{ user.fullname }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
            {{ user.level }}
        </ion-card-content>

    </ion-card>

    <ion-card>
        <ion-list>
            <ion-item>
                <ion-icon name="heart"></ion-icon>
                <ion-label class="sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated"><a
                        href="mailto: {{ user.email }}">{{ user.email }}</a></ion-label>
            </ion-item>
            <ion-item>
                <ion-icon name="heart"></ion-icon>
                <ion-label><a href="tel: {{ user.phone }}">{{ user.phone }}</a></ion-label>
            </ion-item>
            <ion-item>
                <ion-icon name="heart"></ion-icon>
                <ion-label>{{ user.town }}</ion-label>
            </ion-item>
        </ion-list>
    </ion-card>

    <ion-card>
        <!-- STRUCUTRE -->
        <ion-card-header>
            <ion-card-subtitle><ion-icon name="heart"></ion-icon> {{ church.town }}</ion-card-subtitle>
            <ion-card-title>{{ church.name }}</ion-card-title>
        </ion-card-header>

    </ion-card>

    <ion-card>

        <ion-item>
            <ion-icon name="heart"></ion-icon>
            {{ church.address_1 }}<br>
            {{ church.zipcode }} {{ church.town }}
        </ion-item>
        <ion-item>
            <ion-icon name="heart"></ion-icon>
            <ion-label class="sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated"><a
                    href="mailto: {{ church.email }}">{{ church.email }}</a></ion-label>
        </ion-item>
        <ion-item>
            <ion-icon name="heart"></ion-icon>
            <ion-label><a href="tel: {{ church.phone }}">{{ church.phone }}</a></ion-label>
        </ion-item>
    </ion-card>
</template>

<script>

import {mapGetters} from "vuex";
import { IonIcon } from '@ionic/vue';
import sessionStore from "@/store/modules/sessionStore";

export default {
    name: "UserShowComponent",
    components: {
        IonIcon
    },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
            church: 'getChurch',
        }),
    },
    beforeCreate: function () {
        if (!this.$store.hasModule('sessionStore')) {
            this.$store.registerModule('sessionStore', sessionStore);
            this.$store.dispatch('sessionStore/getConnectedUser');
        }
    },
    unmounted   : function () {
        if (this.$store.hasModule('sessionStore')) {
            this.$store.unregisterModule('sessionStore');
        }
    },
};
</script>