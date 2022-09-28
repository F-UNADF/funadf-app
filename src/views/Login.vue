<template>

    <ion-card>
        <ion-card-header>
        <ion-card-subtitle>Connexion</ion-card-subtitle>
        <ion-card-title>Bienvenue</ion-card-title>
        </ion-card-header>

        <ion-card-content>
        <p>Merci d'indiquer votre email et votre mot de passe.</p>
        <ion-input placeholder="Email" autofocus="true" inputmode="email" name="user[email]"></ion-input>

        <ion-input placeholder="Mot de passe" type="password" name="user[password]" pattern="password"></ion-input>

        <ion-button expand="block" >
            
            <ion-icon name="log-in" slot="start" @click="login()"></ion-icon>
            
            Connexion
        </ion-button>
        </ion-card-content>
    </ion-card>
</template>

<script>
    export default {
        name: 'LoginPage',
    }
</script>