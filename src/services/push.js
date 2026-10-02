// Notifications push (Firebase Cloud Messaging via @capacitor-firebase/messaging).
//
// Deux interrupteurs se combinent :
//  - la permission du système (iOS, Android 13+), que seule l'app Réglages peut rendre
//    une fois refusée ;
//  - la préférence de l'utilisateur dans l'écran Paramètres (localStorage.push_enabled).
//    Absente = activée (comportement historique : on demande la permission au 1er lancement).
//
// Désactiver demande au backend d'oublier le jeton (DELETE /api/device_tokens/current?token=)
// et le supprime de l'appareil (deleteToken). Si l'appel serveur échoue, FCM refuse de toute
// façon l'ancien jeton (404) et FcmNotificationService le supprime au premier envoi en échec.
// Réactiver redemande un jeton et le renvoie au backend.
import { Capacitor } from '@capacitor/core';
import { FirebaseMessaging, Importance, Visibility } from '@capacitor-firebase/messaging';
import { isPlatform } from '@ionic/vue';
import store from '@/store';

const PREF_KEY = 'push_enabled';
const TOKEN_KEY = 'firebase_token';
// Une suppression de jeton a échoué (hors ligne…) : on la retente au prochain lancement.
const DELETE_PENDING_KEY = 'push_token_delete_pending';

let currentToken = null;
let sentKey = null;
let retryTimeout = null;
let tokenListener = null;

function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* stockage indisponible */ }
}
function storageRemove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* stockage indisponible */ }
}

export function isPushSupported() {
    return Capacitor.isNativePlatform();
}

export function isPushEnabled() {
    return storageGet(PREF_KEY) !== 'false';
}

// 'granted' | 'denied' (bloquée, à rouvrir dans les réglages) | 'prompt' (on peut demander)
// | 'unsupported' (navigateur)
// Android < 13 répond toujours 'granted', même si les notifications sont coupées
// dans les paramètres du téléphone (limite du plugin).
export async function getPushPermission() {
    if (!isPushSupported()) return 'unsupported';
    try {
        const { receive } = await FirebaseMessaging.checkPermissions();
        if (receive === 'granted' || receive === 'denied') return receive;
        return 'prompt';
    } catch (e) {
        return 'unsupported';
    }
}

async function requestPermissionIfNeeded() {
    let { receive } = await FirebaseMessaging.checkPermissions();
    if (receive !== 'granted' && receive !== 'denied') {
        ({ receive } = await FirebaseMessaging.requestPermissions());
    }
    return receive === 'granted' ? 'granted' : 'denied';
}

async function ensureAndroidChannel() {
    // Canal par défaut Android (les notifications envoyées sans channel_id y arrivent)
    if (!isPlatform('android')) return;
    await FirebaseMessaging.createChannel({
        id: 'default',
        name: 'Notifications',
        description: 'Notifications ADD+',
        importance: Importance.High,
        visibility: Visibility.Public,
        vibration: true,
    });
}

function setToken(token) {
    // Préférence coupée : un éventuel nouveau jeton (auto-init Firebase) n'est jamais envoyé.
    if (!token || !isPushEnabled()) return;
    currentToken = token;
    storageSet(TOKEN_KEY, token);
    sendToken();
}

// Envoie le jeton au backend dès qu'un utilisateur est connecté (rappelé au login).
export async function sendToken() {
    const userId = store.state.sessionStore.user?.id;
    const token = currentToken;

    // Pas encore connecté : App.vue rappelle sendToken() quand l'utilisateur change
    if (!token || !userId || !isPushEnabled()) return;

    // Évite de renvoyer le même jeton pour le même utilisateur dans la session
    const key = `${userId}:${token}`;
    if (sentKey === key) return;
    sentKey = key;

    try {
        await store.dispatch('sessionStore/storeDeviceToken', {
            token: token,
            user_id: userId,
            platform: 'mobile',
        });
    } catch (error) {
        // Échec réseau : on réessaiera plus tard
        if (sentKey === key) sentKey = null;
        clearTimeout(retryTimeout);
        retryTimeout = setTimeout(() => sendToken(), 30000);
    }
}

async function registerDevice() {
    await ensureAndroidChannel();
    // On redemande le jeton à chaque fois : le localStorage n'est qu'un cache
    const { token } = await FirebaseMessaging.getToken();
    setToken(token);
}

function forgetToken() {
    clearTimeout(retryTimeout);
    currentToken = null;
    sentKey = null;
    storageRemove(TOKEN_KEY);
}

async function deleteDeviceToken() {
    const token = currentToken || storageGet(TOKEN_KEY);
    forgetToken();
    // Le serveur oublie le jeton tout de suite (sans attendre l'échec FCM au prochain envoi).
    // Au mieux : une erreur (hors ligne, backend ancien) n'empêche pas la suite.
    if (token) {
        store.dispatch('sessionStore/removeDeviceToken', token).catch(() => {});
    }
    try {
        await FirebaseMessaging.deleteToken();
        storageRemove(DELETE_PENDING_KEY);
        return true;
    } catch (e) {
        storageSet(DELETE_PENDING_KEY, '1');
        return false;
    }
}

// Au lancement de l'app (App.vue, plateforme native uniquement).
export async function initPush() {
    if (!isPushSupported()) return;

    // On écoute les rafraîchissements de jeton avant toute autre chose
    if (!tokenListener) {
        try {
            tokenListener = await FirebaseMessaging.addListener('tokenReceived', ({ token }) => setToken(token));
        } catch (e) {
            // plugin indisponible
        }
    }

    if (!isPushEnabled()) {
        // Désactivées par l'utilisateur : on n'enregistre rien, et on finit une suppression
        // qui aurait échoué hors ligne.
        if (storageGet(DELETE_PENDING_KEY)) await deleteDeviceToken();
        return;
    }

    try {
        if (await requestPermissionIfNeeded() !== 'granted') return;
        await registerDevice();
    } catch (e) {
        // Firebase indisponible : on retentera au prochain lancement
    }
}

// Interrupteur « activé » de l'écran Paramètres.
// Retourne 'granted', 'denied' (permission refusée) ou 'error'.
export async function enablePush() {
    storageSet(PREF_KEY, 'true');
    storageRemove(DELETE_PENDING_KEY);
    if (!isPushSupported()) return 'error';
    try {
        if (await requestPermissionIfNeeded() !== 'granted') return 'denied';
        await registerDevice();
        return 'granted';
    } catch (e) {
        return 'error';
    }
}

// Interrupteur « désactivé ». Retourne false si la suppression du jeton a échoué
// (elle sera retentée au prochain lancement ; la préférence est enregistrée quand même).
export async function disablePush() {
    storageSet(PREF_KEY, 'false');
    if (!isPushSupported()) return true;
    return deleteDeviceToken();
}

// Au retour dans l'app (l'utilisateur a pu autoriser les notifications dans les réglages) :
// si la préférence est active et la permission accordée, on s'assure que le jeton est envoyé.
export async function syncPushRegistration() {
    if (!isPushSupported() || !isPushEnabled()) return;
    if (await getPushPermission() !== 'granted') return;
    try {
        await registerDevice();
    } catch (e) {
        // on retentera au prochain retour ou lancement
    }
}

// À la déconnexion : le téléphone ne doit plus recevoir les notifications du compte
// qui vient de se déconnecter. La préférence est conservée ; un nouveau jeton sera
// créé au prochain lancement et envoyé après la connexion suivante.
export async function unregisterOnLogout() {
    if (!isPushSupported()) return;
    // deleteToken passe par le réseau : on ne bloque pas la déconnexion plus de 3 s
    await Promise.race([
        deleteDeviceToken(),
        new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
}

// Réglages de l'app dans le téléphone. iOS : le schéma app-settings: est confié au système
// par Capacitor (navigation hors de l'app). Android : aucun plugin installé ne sait ouvrir
// ces réglages, l'écran affiche alors le chemin à suivre.
export function canOpenAppSettings() {
    return isPushSupported() && isPlatform('ios');
}

export function openAppSettings() {
    if (!canOpenAppSettings()) return false;
    window.location.href = 'app-settings:';
    return true;
}
