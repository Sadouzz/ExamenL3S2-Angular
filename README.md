# BadWallet - Frontend Angular

Bienvenue dans l'interface utilisateur de **BadWallet**, le frontend de notre application de gestion de portefeuilles électroniques. Cette application a été générée avec [Angular CLI](https://github.com/angular/angular-cli) version 17+ et utilise les Standalone Components pour une architecture moderne et légère.

## Fonctionnalités

L'application est divisée en deux espaces principaux :

### Espace Agent (Administration)
- **Liste des portefeuilles** : Vue globale de tous les portefeuilles clients enregistrés sur la plateforme.
- **Création de compte** : Interface pour ouvrir un nouveau portefeuille pour un client.
- **Opérations guichet** : Réalisation de Dépôts et Retraits directement sur le compte d'un client.

### Espace Client (Self-Service)
- **Tableau de bord (Dashboard)** : Résumé du solde actuel et calcul automatique des revenus et dépenses du mois en cours.
- **Transfert d'argent** : Envoi de fonds vers un autre numéro de téléphone.
- **Historique des transactions** : Tableau filtrable (par type d'opération et par date) listant tous les mouvements du compte.
- **Paiement de factures** : Consultation des factures impayées (SENELEC, WOYAFAL, ISM, etc.) et système de paiement par sélection multiple.

## Démarrage rapide

### 1. Prérequis
- Node.js installé sur votre machine.
- Le backend Spring Boot (`badwallet-api` et `payment-service`) en cours d'exécution pour que les appels API fonctionnent.

### 2. Installation des dépendances
Ouvrez votre terminal dans le dossier `angular/badwallet` et lancez :
```bash
npm install
```

### 3. Lancer le serveur de développement
Démarrez l'application avec :
```bash
ng serve
```
L'application sera accessible sur `http://localhost:4200/`. Le serveur rechargera automatiquement la page si vous modifiez un fichier source.

## Configuration Proxy
Pour éviter les problèmes de CORS lors du développement, le projet utilise un proxy configuré dans `proxy.conf.json`. Toutes les requêtes envoyées à `/api` sont automatiquement redirigées vers le backend sur `http://localhost:8080`.

## Architecture du code

Le code source (`src/app/`) est structuré ainsi :
- `core/` : Services globaux (`WalletApiService`, `BillingApiService`), intercepteurs HTTP (gestion des erreurs), et gestion de l'état global (`BalanceStore`).
- `features/` : Les composants liés aux fonctionnalités métiers, séparés en deux dossiers :
  - `agent/` : Composants de l'espace administration.
  - `client/` : Composants de l'espace utilisateur final.
- `shared/` : Composants réutilisables (Toasters, Loaders), Pipes de formatage (XofPipe) et Validateurs personnalisés.
