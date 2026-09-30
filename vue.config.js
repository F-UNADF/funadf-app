module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // Le SDK JS Firebase n'est pas installé : les notifications push ne sont
        // utilisées que sur mobile (implémentation native de @capacitor-firebase/messaging).
        // L'implémentation web du plugin importe 'firebase/messaging' : on la remplace
        // par un module vide pour ne pas embarquer le SDK dans le bundle.
        'firebase/messaging': false,
      },
    },
  },
};
