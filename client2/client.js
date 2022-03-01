const Issuer = require("openid-client").Issuer;

/* On crée le client de la bibliothèque open-id client qu'on va utiliser pour 
    les interactions avec l'Identity Provider
*/
module.exports = async () => {
  const localhostIssuer = await Issuer.discover(
    `${process.env.PROVIDER_URL}oidc`
  );

  const client = new localhostIssuer.Client({
    client_id: "client2",
    client_secret: "client2",
    redirect_uris: [`${process.env.CLIENT_URL_2}redirect`],
    post_logout_redirect_uris: [`${process.env.CLIENT_URL_2}login`],
  });

  return client;
};
