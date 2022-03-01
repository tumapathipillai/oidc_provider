const router = require("express").Router();
const { strict: assert } = require("assert");
const oidc = require("../utils/provider");
const {
  checkCredentials,
  getUserWebId,
  addInfoOfUser,
} = require("../database");
const { fetchUserInformations } = require("../utils/fetchUserInformations");
const configuration = require("../configuration");

/* Cette route redirige l'utilisateur selon l'action a effectué, soit une connexion soit l'autorisation du site client */
router.get("/", async (req, res, next) => {
  try {
    const { uid, prompt, params } = await oidc.interactionDetails(req, res);

    const client = await oidc.Client.find(params.client_id);

    switch (prompt.name) {
      // Cas où l'utilisateur doit se connecter
      case "login": {
        return res.render("login", {
          uri: process.env.PROVIDER_URL,
          uid,
          params,
          error: "",
        });
      }
      // Cas où l'utilisateur doit approuver l'autorisation
      case "consent": {
        // scopeData est un tableau contenant les informations demandées par l'utilisateur
        const scopeData = [];
        prompt.details.missingOIDCScope
          .filter((scope) => scope != "openid")
          .forEach((scope) =>
            configuration.claims[scope].forEach((data) => scopeData.push(data))
          );

        return res.render("consent", {
          uri: process.env.PROVIDER_URL,
          uid,
          details: scopeData,
        });
      }
      default:
        return undefined;
    }
  } catch (err) {
    return next(err);
  }
});

/* Cette route récupére les informations de connexion de l'utilisateur */

router.post("/login", async (req, res, next) => {
  try {
    //On vérifie que le mot de passe correspond à ce que l'on a dans la base de données
    const account = await checkCredentials(req.body.login, req.body.password);

    // Si le mot de passe ne correspond pas, on le redirige vers la page de connexion
    if (!account) {
      const { uid, prompt, params } = await oidc.interactionDetails(req, res);

      const client = await oidc.Client.find(params.client_id);

      return res.render("login", {
        uri: process.env.PROVIDER_URL,
        client,
        uid,
        details: prompt.details,
        params,
        title: "Sign-in",
        error: "username_password_error",
      });
    } else {
      // On récupére le webId de l'utilisateur
      const webId = await getUserWebId(req.body.login);
      /*
        On récupére les informations de l'utilisateur depuis son Pod
        Solid pour les ajouter temporairement dans la base de données
      */
      const infos = await fetchUserInformations(webId);

      addInfoOfUser(
        req.body.login,
        JSON.stringify({
          ...infos,
          sub: req.body.login,
        })
      );

      const result = {
        login: {
          accountId: req.body.login,
        },
      };

      await oidc.interactionFinished(req, res, result, {
        mergeWithLastSubmission: true,
      });
    }
  } catch (err) {
    next(err);
  }
});

/* Cette route récupére le consentement de l'utilisateur à fournir ses informations au client
C'est notamment cette route qui redirige l'utillisateur vers le site client */
router.post("/confirm", async (req, res, next) => {
  try {
    const interactionDetails = await oidc.interactionDetails(req, res);
    const {
      prompt: { name, details },
      params,
      session: { accountId },
    } = interactionDetails;

    assert.equal(name, "consent");

    let { grantId } = interactionDetails;
    let grant;

    /*
      Si le client posséde déjà une autorisation, on la met à jour
      sinon on en crée une nouvelle. Puis on sauvegarde cette autorisation
    */
    if (grantId) {
      grant = await oidc.Grant.find(grantId);
    } else {
      grant = new oidc.Grant({
        accountId,
        clientId: params.client_id,
      });
    }

    if (details.missingOIDCScope) {
      grant.addOIDCScope(details.missingOIDCScope.join(" "));
    }

    grantId = await grant.save();

    const consent = {};
    if (!interactionDetails.grantId) {
      consent.grantId = grantId;
    }

    const result = { consent };

    // On redirige l'utilisateur vers le site client
    await oidc.interactionFinished(req, res, result, {
      mergeWithLastSubmission: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
