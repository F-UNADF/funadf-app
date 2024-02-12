<template>
    <ion-content>
        <img :src="this.takenPicture ? this.takenPicture : getAvatar" />
        <ion-list class="ion-margin-bottom" lines="none">
            <ion-item class="text-center justify-content-center">
                <ion-button @click="takePicture()">Changer mon image</ion-button>
            </ion-item>
            <ion-item fill="outline">
                <ion-label position="stacked">Nom</ion-label>
                <ion-input v-model="this.editedUser.lastname"></ion-input>
            </ion-item>
            <ion-item fill="outline">
                <ion-label position="stacked">Prénom</ion-label>
                <ion-input v-model="this.editedUser.firstname"></ion-input>
            </ion-item>
            <ion-item fill="outline">
                <ion-label position="stacked">Adresse</ion-label>
                <ion-input v-model="this.editedUser.address_1"></ion-input>
            </ion-item>
            <ion-item fill="outline">
                <ion-label position="stacked">Code Postal</ion-label>
                <ion-input v-model="this.editedUser.zipcode"></ion-input>
            </ion-item>
            <ion-item fill="outline">
                <ion-label position="stacked">Ville</ion-label>
                <ion-input v-model="this.editedUser.town"></ion-input>
            </ion-item>
            <ion-item fill="outline">
                <ion-label position="stacked">Téléphone</ion-label>
                <ion-input v-model="this.editedUser.phone_1"></ion-input>
            </ion-item>
            <ion-item fill="outline">
                <ion-label position="stacked">Date de naissance</ion-label>
                <ion-input type="date" v-model="this.editedUser.birthdate"></ion-input>
            </ion-item>
        </ion-list>

        <ion-list lines="none">
            <ion-item @click="saveUser()" color="primary">
                <ion-label>Enregistrer</ion-label>
                <i class="material-icons" style="margin-left: 10px;">chevron_right</i>
            </ion-item>
        </ion-list>
    </ion-content>
</template>

<script>

import { IonInput, IonLabel, IonButton, IonItem, IonList, IonContent } from '@ionic/vue';
import { mapGetters } from 'vuex';
import { Camera, CameraResultType } from '@capacitor/camera';

export default {
    name: "UserShowComponent",
    components: { IonInput, IonLabel, IonButton, IonItem, IonList, IonContent },
    computed: {
        ...mapGetters('sessionStore', {
            user: 'getUser',
            church: 'getChurch',
            token: 'getToken',
        }),
        getAvatar() {
            let base_url = 'https://add-fnadf.fr';
            return base_url + '/avatars/' + this.user.id + '.png?cache=' + this.cache;
        },
    },
    methods: {
        saveUser() {
            let formData = new FormData();
            formData.append('user[user][lastname]', this.editedUser.lastname);
            formData.append('user[user][firstname]', this.editedUser.firstname);
            formData.append('user[user][address_1]', this.editedUser.address_1);
            formData.append('user[user][zipcode]', this.editedUser.zipcode);
            formData.append('user[user][town]', this.editedUser.town);
            formData.append('user[user][phone_1]', this.editedUser.phone_1);
            formData.append('user[user][birthdate]', this.editedUser.birthdate);

            this.$store.dispatch('usersStore/save', { id: this.editedUser.id, payload: formData }).then(() => {
                this.$root.presentToast('Votre profil a été mis à jour !');
                this.$router.push('/user');
            });
        },
        takePicture() {
            Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                cameraSource: 'Prompt',
                resultType: CameraResultType.Uri,
            }).then((image) => {
                this.takenPicture = image.Uri;

                fetch(image.webPath)
                    .then(response => response.blob())
                    .then(blob => {
                        // Create FormData and append the Blob
                        let formData = new FormData();
                        formData.append('user[user][avatar]', blob, 'photo.jpg');

                        this.$store.dispatch('usersStore/save', { id: this.user.id, payload: formData },
                            {
                                headers: { "Content-Type": "multipart/form-data" }
                            }).then(() => {
                                this.$root.presentToast('Votre avatar a été mis à jour !');
                                this.cache = new Date().getTime();
                            });

                    });
            }).catch((error) => {
                console.error(error);
            });
        },
    },
    watch: {
        user: {
            handler: function () {
                this.editedUser = JSON.parse(JSON.stringify(this.user));
            },
            deep: true,
        },
    },
    beforeCreate: function () {
        this.$store.dispatch('sessionStore/getConnectedUser');

        if (null === this.token || null === this.user) {
            this.$router.push({ name: 'Login', replace: true });
        }
    },
    data() {
        return {
            editedUser: {},
            takenPicture: null,
            cache: new Date().getTime(),
        };
    },
};
</script>

<style scoped></style>