const generators = require("openid-client").generators;
const router = require("express").Router();
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);
const getClient = require("../client");

/* Cette route vérifie que l'utilisateur est connecté
    c'est à dire qu'on possède son token d'accès
*/
router.get("/login", async (req, res) => {
  if (req.session.accessToken) {
    res.redirect("/infos");
  } else {
    const client = await getClient();
    const redirectUri = client.authorizationUrl({
      scope: "openid identity",
      redirect_uri: `${process.env.CLIENT_URL_1}redirect`,
      code_challenge,
      code_challenge_method: "S256",
    });
    return res.render("login", { redirectUri });
  }
});

/* Cette route récupère les tokens liés à un utilisateur
    suite à la connexion sur l'Identity Provider de ce dernier
*/
router.get("/redirect", async (req, res) => {
  const client = await getClient();
  const params = client.callbackParams(req);
  const tokenSet = await client.callback(
    `${process.env.CLIENT_URL_1}redirect`,
    params,
    { code_verifier }
  );

  req.session.accessToken = tokenSet.access_token;
  res.redirect("/infos");
});

/* Cette route affiche les informations de l'utilisateur
    grâce à une rêquete sur l'Identity Provider
*/
router.get("/infos", async (req, res) => {
  if (!req.session.accessToken) {
    res.redirect("/login");
  } else {
    try {
      const client = await getClient();
      const userinfo = await client.userinfo(req.session.accessToken);

      return res.render("infos", {
        email: userinfo.email,
        nom: userinfo.lastName,
        prenom: userinfo.firstName,
      });
    } catch (err) {
      req.session.destroy();
      res.redirect("/login");
    }
  }
});

/* Cette route déconnecte l'utilisateur
 */
router.get("/disconnect", async (req, res) => {
  const client = await getClient();
  const url = client.endSessionUrl({
    client_id: "client1",
    post_logout_redirect_uri: `${process.env.CLIENT_URL_1}login`,
    redirect_uri: `${process.env.CLIENT_URL_1}redirect`,
  });
  res.redirect(url);
});

module.exports = router;
