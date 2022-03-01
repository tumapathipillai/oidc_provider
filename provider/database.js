/*
  Ce fichier définit les différentes intéractions concernant l'utilisateur avec la base de données 
*/

const client = require("./utils/redisClient");

/*
  Cette méthode permet d'ajouter temporairement les données de l'utilisateur dans la base de données 
*/
module.exports.addInfoOfUser = async (id, data) => {
  return await client.setex(`User:${id}`, 60 * 60, data);
};

/*
  Cette méthode permet de récupérer les informations de l'utilisateur
*/
module.exports.getUserData = async (id) => {
  return await client.get(`User:${id}`);
};

/*
  Cette méthode permet de récupérer le webId de l'utilisateur
*/
module.exports.getUserWebId = async (id) => {
  return JSON.parse(await client.hget("login", id)).webId;
};

/*
  Cette méthode permet de vérifier que les identifiants de l'utilisateur correspondent
*/
module.exports.checkCredentials = async (username, password) => {
  const user = JSON.parse(await client.hget("login", username));
  if (user) {
    return user.password === password;
  } else {
    return false;
  }
};
