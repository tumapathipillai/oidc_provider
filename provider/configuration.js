/*
  Ce fichier définit la configuration du Provider
*/

const RedisAdapter = require("./adapter");
const { getUserData } = require("./database");
const { logout } = require("./views/logout.js");

module.exports = {
  // On indique l'adapter à utiliser
  adapter: RedisAdapter,
  // Permet de récupérer les informations de l'utilisateur
  async findAccount(ctx, id, token) {
    return {
      accountId: id,
      async claims(use, scope) {
        return JSON.parse(await getUserData(id));
      },
    };
  },
  // Permet d'afficher l'erreur quand il y en a une
  renderError(ctx, out, error) {
    console.log(error);
  },
  // Jeu de clé nécessaire aux différentes intéractions.
  jwks: {
    keys: [
      {
        p: "0DpZn7c2uiXDwwXuhqo9xE4-YVmm2nJa6eaQC8IPv_mDM6Z0QfhPBCie5FIBhrbPN_pryLveJHXNKTspeZR7RY5PZH1eglNbyXM9Xf3EwYlR6wRb2M-VOMDwMMWoYuXEwdTucQq5prplLO2dMnReP5rxsRRw_vgNRhzAoc5tAVE",
        kty: "RSA",
        q: "ptEO8lgsKTx4phfcA7gGkC9nKse696OCrVLLEGvBa15DLJGdZaJZnlNRLbN_ThlFnrh6_lWaeUmQaWFL_hZjF22kGudbzYFrli1wfp46BxUCop7K8sddzJzfSMgbjSZwO423Yur7P99zgrv3Ihtmhv2yVTL1-8jRR1Io-g47Qvk",
        d: "NmdR-CQB_LU_zmbfcq49d0cxLSUFzfkR0zAtCWKiNlj4-WHAhvAlPVU92t5o8UZyDmXpa_N8aMKKu7KVLRIzzgUyFwNOuaCNV_dYQScibMNSvVW8HNWHsYfQ51np3J2PDOgTJKB4Iyc504k1ycgR6jgb5q7KcmGaSYmZJaFcwqSauhTqemcMUJdOyA0_VVo7gf2WpLskb1q3tPvr_of6lrrYodqc_E_E4LfBBTF5iYFok0ziaMOKevbB134nlyKbdTarRFYsXbXZKG_3A1jgQF8bnzsxs-M9emeg6Lq52UZ5iNaY9IXNBzN0mx4rGFCjO4xgNLeXPrSHTv7W7L7rgQ",
        e: "AQAB",
        use: "sig",
        qi: "TcjeKnoF3nSBW935Mz5xNiNokFHmNudQN2ExwDlvujZyYevjHAPQakx1fox7s49bhdAmbcPPKOS-48jS1pwWz_phvPRkCWCB0DDNNtnn9pw8T9sm-CXu8nTJnNJVuPRMMFiGEyePrz0eMm0fDSH-Z1lFAeFF1zlIYOqa1lLByUg",
        dp: "iOHyzMWaGmB9AhVCKhB7rjJpW4Gd5_hIv34rry8RP3f8wdVok31yJB-35AvsqOw_6GKcvEaTz5AJIFOd_iiXqK_WjQ7FNBMsQY-aBdGuqDNnQIGLB0nepIJg4w7slKbK40jgvjr4tBvQKurA7cwFsPZgb7IqXdIel7qK_1M94SE",
        alg: "RS256",
        dq: "C-HAKsrU-mrwPQReC3XEIej-dDGdw53F5QqMpDLIqBkit733dBHISFqu4Y5zduCd8Nw7BnqaciEnRBpGC2cUz8pjcfcgttaNDzlVVe93OqHoeiTNV9WTfMt_q_N04uzl-Zfyg_0wwC_uTlWNGMTS3LKdTSxAERsQrP_RI154IiE",
        n: "h6_h6Qv5f8N8R6blGNSKbyqviodPp0tp5Gjec-lQ3IUm55o6_Ko4Yjonay2kIGCtOjXVo43IuWgIolIPBPPrE1ksQvaOniaC4khjTIoueFXOTQcYx8X6ydZihq-0nme2wu-kn510J4w7OLNtnvb3Q5BBnN5U6AZH1PAJ9_otiS6EbXE_J909YVEHcWaAARyjZ_YLgVAjzyW0Stb-ZCjhhaznMk3K8F6fs9r3RLnrPVJrwQ1GzoBulHZk838_5TA0b0rNuNt7T2hxVRHkFbSZ9vhDikwHqW4UjSPOyI6Vm_9lLHtFdZ8Xz0S8oBaReb0TLErIOJKJh9Nbz47lnggpyQ",
      },
    ],
  },
  // route permettant les intéraction de l'utilisateur
  interactions: {
    url(ctx, interaction) {
      return `/interaction/${interaction.uid}`;
    },
  },
  // Domaine d'autorisation possible pour les différents sites client
  claims: {
    identity: ["firstName", "lastName"],
    mail: ["email"],
  },
  features: {
    // Désactivation des by-pass utilisables pour le développement uniquement
    devInteractions: {
      enabled: false,
    },
    // Permet la déconnexion de l'utilisateur
    rpInitiatedLogout: {
      logoutSource: async function logoutSource(ctx, form) {
        ctx.body = logout(ctx, form);
      },
    },
  },
  ttl: {
    AccessToken: 60 * 60, // Définit la durée à partir de laquelle le site client ne peut plus utiliser son token pour récupérer les données
    Session: 60 * 60, // Définit la durée à partir de laquelle l'utilisateur devra se reconnecter au sso en rentrant ses identifiants
  },
};
