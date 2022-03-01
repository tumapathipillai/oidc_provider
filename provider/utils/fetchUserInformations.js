const {
  getSolidDataset,
  getThing,
  getStringNoLocale,
} = require("@inrupt/solid-client");
const { Session } = require("@inrupt/solid-client-authn-node");
const { FOAF } = require("@inrupt/vocab-common-rdf");

module.exports.fetchUserInformations = async (webId) => {
  // 1. Nous créons une nouvelle session
  const session = new Session();

  try {
    /* 2. Nous allons chercher le Solid Dataset contenant les informations
    de l'utilisateur, en spécifiant sa location (l'URI du Dataset). */
    const userInformationsDataset = await getSolidDataset(
      webId + "public/userInformations",
      { fetch: session.fetch }
    );

    /* 3. A partir du Dataset, nous récupérons la description de l'utilisateur
    identifiée par le namespace `#user1` (voir la fin de l'URI ci-dessous). */
    const userInformations = getThing(
      userInformationsDataset,
      webId + "public/userInformations#user1"
    );

    /* 4. A partir de la description de l'utilisateur, nous récupérons une par une les informations
    qui nous intéressent à partir des prédicats (ici : FOAF.firstName, FOAF.lastName et FOAF.mbox). */
    const firstName = getStringNoLocale(userInformations, FOAF.firstName);
    const lastName = getStringNoLocale(userInformations, FOAF.lastName);
    const email = getStringNoLocale(userInformations, FOAF.mbox);

    return { firstName, lastName, email };
  } catch (err) {
    return err;
  }
};
