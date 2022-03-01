# GUIDE D'UTILISATION

## Variable d'environnement

Le projet contient des variables d'environnement. Les différentes variables d'environnement sont contenues dans un ficher _.env_. Pour créer ce fichier _.env_, il faut dupliquer le fichier [.env_template](.env_template), remplacer les valeurs par les valeurs correspondantes à votre système si besoin. Enfin, il faut renommer le fichier en _.env_.

## Installation des dépendances

Le projet est constitué de trois parties : un fournisseur d'identité et deux sites clients différents. Pour le bon fonctionnement du projet, il faut installer les dépendances des trois parties. Ainsi, il faut lancer la commande `npm i` depuis les trois dossiers [client1](client1), [client2](client2) et [provider](provider).

## Base de données

Nous utilisons une base de données Redis pour le stockage des données. Pour utiliser le projet, il vous faudra avoir un serveur Redis fonctionnel dont l'url seront renseignés dans le ficher _.env_ précédemment cité.

Cette base de données peut être initialisée grâce à la commande `npm run seed`. Les données d'initialisation sont disponibles dans le fichier [seed.js](provider/seed.js). Ces données peuvent être modifiées à souhait. Toutefois, elles doivent correspondre aux schémas de la base de données fournis dans le document de conception.

## Lancement du projet

Le fonctionnement de ce projet repose sur le lancement des trois serveurs de développement : le premier serveur pour le fournisseur d'identité et deux autres serveurs pour les deux clients fictifs.

Pour lancer ce projet :

- Il faut lancer le serveur du fournisseur d'identité avec la commande `npm run start` depuis le dossier [provider](provider).
- Il faut lancer les deux serveurs des deux clients depuis les dossiers [client1](client1) et [client2](client2) grâce à la commande `npm run start`.

Les pages de connexion sont disponibles sur la routes `\login` aux adresses fournies dans votre _.env_ (par défaut [ici](http://localhost:8080/login) pour le client 1 et [ici](http://localhost:8081/login) pour le client 2).
