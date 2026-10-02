// Thème de l'app : « system » (suit le téléphone), « light » ou « dark ».
// Le choix est persisté dans localStorage.theme et appliqué via data-theme sur :root
// (voir src/theme/variables.css). En mode « system », on suit les changements du téléphone.
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';

const STORAGE_KEY = 'theme';
export const THEMES = ['system', 'light', 'dark'];

let systemMql = null;

function readPreference() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(value) ? value : 'system';
    } catch (e) {
        return 'system';
    }
}

// Edge-to-edge (Android 15+) : les barres système sont transparentes au-dessus de l'app,
// la couleur des icônes doit donc suivre le thème de l'app (pas seulement celui du téléphone).
// Dark = icônes claires (fond sombre), Light = icônes sombres (fond clair).
function syncSystemBars(isDark) {
    if (!Capacitor.isNativePlatform()) return;
    SystemBars.setStyle({ style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => {});
}

function setRootTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    syncSystemBars(isDark);
}

function onSystemThemeChange(e) {
    // Ne réagit que si l'utilisateur a choisi de suivre le téléphone
    if (readPreference() !== 'system') return;
    setRootTheme(e.matches);
}

function ensureSystemListener() {
    if (systemMql) return systemMql;
    systemMql = window.matchMedia('(prefers-color-scheme: dark)');
    // Safari iOS ancien : addListener / removeListener
    if (systemMql.addEventListener) {
        systemMql.addEventListener('change', onSystemThemeChange);
    } else {
        systemMql.addListener(onSystemThemeChange);
    }
    return systemMql;
}

export function getThemePreference() {
    return readPreference();
}

export function applyTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
        setRootTheme(theme === 'dark');
        return;
    }
    setRootTheme(ensureSystemListener().matches);
}

export function setThemePreference(theme) {
    const value = THEMES.includes(theme) ? theme : 'system';
    try {
        localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
        // stockage indisponible : le thème s'applique quand même pour la session
    }
    applyTheme(value);
    return value;
}

export function initTheme() {
    // L'écouteur système est posé une fois pour toute la vie de l'app,
    // pour pouvoir repasser en « system » à tout moment.
    ensureSystemListener();
    applyTheme(readPreference());
}
