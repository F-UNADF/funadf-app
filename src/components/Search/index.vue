<template>
    <ion-header>
        <ion-searchbar animated="true" placeholder="Ville, Nom, Code postal" :value="search"
            @input="search = $event.target.value"></ion-searchbar>
    </ion-header>
    <ion-content>
        <ion-list class="profile-card">
            <ion-item v-for="result in results" :key="result.id"
                @click="$router.push(`/annuaire/${result.model_type}/${result.id}`)">
                <ion-avatar slot="start">
                    <img :src="result.photo_url" :alt="result.name" />
                </ion-avatar>
                <ion-label style="display: flex;" class="ion-align-items-center">
                    <i class="material-icons" style="margin-right: 10px;">{{ result.icon }}</i>
                    {{ result.name }}
                </ion-label>
                <i class="material-icons" style="margin-left: 10px;">chevron_right</i>
            </ion-item>
        </ion-list>
    </ion-content>
</template>

<script>
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSearchbar, IonHeader } from '@ionic/vue';
import axios from 'axios';

export default {
    name: "VotesIndex",
    components: {
        IonContent,
        IonList,
        IonItem,
        IonAvatar,
        IonLabel,
        IonSearchbar,
        IonHeader,
    },
    data() {
        return {
            search: '',
            results: [],
        };
    },
    methods: {
        searchItems() {
            // refresh if search length is less than 3
            if (this.search.length < 3) {
                this.results = [];
                return true;
            }
            let base_url = 'https://add-fnadf.fr';
            // Make the HTTP request to /api/search with the search query as a parameter
            axios.get(base_url + '/api/search', {
                params: {
                    query: this.search,
                },
            }).then((res) => {
                this.results = res.data;
            }).catch((error) => {
                console.error('Error searching:', error);
            });
        },
    },
    watch: {
        search: function () {
            this.searchItems();
        }
    },
    beforeCreate: function () {
        this.$store.dispatch('sessionStore/fetchUser');

        if (null === this.token || null === this.user) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
};
</script>

<style scoped>
.profile-card ion-img {
    border-radius: 100%;
}
</style>