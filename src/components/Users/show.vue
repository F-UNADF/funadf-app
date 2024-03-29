<template>
    <ion-card color="primary">
        <ion-card-header>
            <div class="avatar">
                <ion-img :src=getAvatar alt="Avatar {{ user.lastname }} {{ user.firstname }}"></ion-img>
            </div>
            <ion-card-title>{{ user.lastname }} {{ user.firstname }}</ion-card-title>
            <ion-toolbar color="transparent">
                <ion-chip>
                    <i class="material-icons mr-3">account_box</i>
                    <ion-label>{{ user.id }}</ion-label>
                </ion-chip>
                <ion-chip><i class="material-icons mr-3">bookmark</i>
                    <ion-label>{{ level }}</ion-label>
                </ion-chip>
                <ion-button v-if="this.canEdit" shape="rounded" size="small" slot="end" fill="outline" color="dark"
                    @click="this.$router.push('user/edit');">
                    <i slot="icon-only" class="material-icons">edit</i>
                </ion-button>
            </ion-toolbar>

        </ion-card-header>
        <ion-list lines="full">
            <ion-item color="primary" v-if="!!user.email">
                <i class="material-icons mr-3">mail</i>
                <a href="mailto: {{ user.email }}" color="light">{{ user.email }}</a>
            </ion-item>
            <ion-item color="primary" v-if="!!user.phone_1">
                <i class="material-icons mr-3">phone</i>
                <a href="tel: {{ user.phone_1 }}">{{ user.phone_1 }}</a>
            </ion-item>
            <ion-item color="primary" v-if="!!user.town">
                <i class="material-icons mr-3">location_on</i>
                {{ user.town }}
            </ion-item>
        </ion-list>
    </ion-card>

    <ion-card color="secondary" v-if="!!church">
        <!-- STRUCUTRE -->
        <ion-card-header>
            <ion-card-title>{{ church.name }}</ion-card-title>
        </ion-card-header>
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
    </ion-card>
</template>

<script>
import { IonCard, IonCardHeader, IonCardTitle, IonToolbar, IonChip, IonButton, IonImg, IonLabel, IonList, IonItem } from '@ionic/vue';

export default {
    name: "UserShowComponent",
    components: {
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonToolbar,
        IonChip,
        IonButton,
        IonImg,
        IonList,
        IonItem,
        IonLabel,
    },
    props: {
        user: Object,
        church: Object,
        canEdit: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        getAvatar() {
            let base_url = 'https://add-fnadf.fr';
            return base_url + '/avatars/' + this.user.id + '.png' + '?cache=' + new Date().getTime();
        },
        level() {
            if (this.user && !this.user.gratitudes) {
                return 'N/A';
            }
            const gratitudes = this.user.gratitudes;
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