<template>
    <ion-content>
        <ion-button fill="clear" @click="goBack">
            <i class="material-icons">arrow_back</i>
        </ion-button>
        <user-show :user="searchedUser" v-if="searchedUser" :canEdit="false"></user-show>
        <church-show :church="searchedChurch" :members="structureMembers" v-if="searchedChurch"></church-show>
        <association-show :association="searchedAssociation" :members="structureMembers"
            v-if="searchedAssociation"></association-show>
    </ion-content>
</template>

<script>

import { mapGetters } from 'vuex';
import { IonContent, IonBackButton } from '@ionic/vue';
import UserShow from '@/components/Users/show.vue';
import ChurchShow from '@/components/Churches/show.vue';
import AssociationShow from '@/components/Associations/show.vue';
import axios from 'axios';

export default {
    name: "SearchShow",
    components: { IonContent, UserShow, ChurchShow, AssociationShow, IonBackButton },
    computed: {
        ...mapGetters({
            user: 'getUser',
            fees: 'getFees',
            token: 'getToken',
        }),
    },
    data() {
        return {
            type: null,
            id: null,
            searchedUser: null,
            searchedChurch: null,
            searchedAssociation: null,
            structureMembers: null,
        };
    },
    methods: {
        getItem() {
            this.type = this.$route.params.type;
            this.id = this.$route.params.id;

            let base_url =
                process.env.NODE_ENV === "production"
                    ? "https://add-fnadf.fr"
                    : "http://app.localhost:3000";

            let endpoint = base_url + '/api/' + this.type.toLowerCase() + '/' + this.id;

            axios.get(endpoint).then((res) => {
                this.searchedUser = res.data.user;
                if (this.searchedUser) {
                    this.searchedUser.gratitudes = res.data.gratitudes;
                }
                this.searchedChurch = res.data.church;
                this.searchedAssociation = res.data.association;
                this.structureMembers = res.data.members;
            });
        },
        goBack() {
            this.$router.back();
        }
    },
    created: function () {
        this.getItem();
    },
    watch: {
        '$route': 'getItem'
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
.avatar {
    text-align: center;
    min-height: 25vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar ion-img {
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