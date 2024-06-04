# Meteo de la mobilité pendant les JO

![](/docs/poc_meteo_illustration.png)

Ce projet est une preuve de concept de tableau de bord pour suivre les évolutions de la mobilité jour après jour durant les Jeux olympiques de l'été 2024.

Il exploite des données de traces de mobilités et d'open data comme sources. C'est de fait aussi une preuve de concept technique d'indicateurs constructibles à partir de traces de mobilités. Ces dernières sont définies comme un trajet effectué par une personne au sein d'un unique mode de transport. On y retrouve généralement :

* Un identifiant utilisateur
* Le mode de transport utilisé (marche, vélo, bus, voiture personnelle, etc.)
* Les dates de départ et d'arrivée
* Une série de coordonnées (latitude et longitude), souvent appelée "trace GPS"
* (optionnel) la raison du déplacement

Parfois, ces données sont assimilables aux données de "Floating Car Data" ou "Floating Cellular Data", avec comme différence l'usage de smartphones comme outil de mesure, permettant une meilleure précision et une meilleure identification du mode de transport.

Cette preuve de concept entre dans un ensemble de projets portés par la Fabrique des Mobilités en 2024-2025 autour des traces de mobilités. Consultez [ce document](https://pad.fabmob.io/s/Ytda1XrAH#) pour plus de détails et pour y participer.

## Architecture du projet

Ce projet s'inspire de l'architecture du projet plus complet https://openmobilityindicators.org. Il est décomposé en deux :
* Le dossier `computations` contient un ensemble de scripts Python (jupyter notebooks) qui chargent les données sources (CSV) et génèrent des fichiers JSON ou GeoJSON sauvegardés dans `static/data`
* Le dossier `static` contient un site web en React utilisant des `components` pour afficher les données JSON et GeoJSON. Le site utilise des CDN pour toutes ses librairies et ne requiert de fait pas d'étape de compilation.

## Ajout d'indicateur

Pour ajouter un indicateur, les étapes suivent l'architecture :
* Créer un notebook dans le dossier `computation`
* Concevoir ou utiliser un component existant pour afficher le résultat
* Ajouter le component au tableau de bord `index.js`

Satisfait de votre ajout, vous pouvez alors proposer une Pull Request sur ce dépôt et votre indicateur sera ajouté au site officiel.

## Fréquence des calculs

Nous prévoyons une génération des indicateurs une fois par jour.

## Données sources

Les données sources étant sensibles, elles ne sont pour le moment pas incluses dans ce dépôt. Un fichier CSV d'exemple avec des données fictives est tout de même inclus pour en comprendre le format dans le dossier `sources`.

Les indicateurs générés doivent de fait garantir l'anonymat des participants, par exemple en s'assurant qu'une statistique agrégée toujours plus de 4 personnes.