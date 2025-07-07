# Documentation du Frontend

## 1. Aperçu du Projet

### Objectif
Interface utilisateur moderne pour la plateforme de formation, offrant une expérience d'apprentissage fluide et interactive.

### Technologies Clés
- **Framework** : React 18+ avec TypeScript
- **Gestion d'état** : Redux Toolkit / React Query
- **Styling** : TailwindCSS + composants personnalisés
- **Build** : Vite
- **Tests** : Jest + React Testing Library

## 2. Structure du Projet

```
in-extremis-formation/
├── public/                 # Fichiers statiques
├── src/
│   ├── assets/            # Images, polices, etc.
│   ├── components/        # Composants réutilisables
│   │   ├── ui/           # Composants UI de base
│   │   └── features/     # Composants métier
│   │
│   ├── features/          # Fonctionnalités (feature-based)
│   │   ├── auth/         # Authentification
│   │   ├── courses/      # Gestion des cours
│   │   └── player/       # Lecteur vidéo
│   │
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitaires et configurations
│   ├── pages/             # Pages de l'application
│   ├── services/          # Appels API
│   ├── store/             # État global (Redux)
│   ├── types/             # Définitions TypeScript
│   │
│   ├── App.tsx           # Composant racine
│   └── main.tsx          # Point d'entrée
│
├── .env.development      # Variables d'environnement
└── package.json
```

## 3. Architecture

### Flux de Données
1. **API Calls** : Via des services dédiés
2. **Gestion d'État** : 
   - État local : `useState` / `useReducer`
   - État global : Redux Toolkit
   - Données serveur : React Query

### Routing
- **React Router v6**
- Routes protégées pour les zones authentifiées
- Chargement paresseux (lazy loading) des pages

## 4. Intégrations

### API Backend
- URL de base : `/api` (proxy vers le backend)
- Authentification : JWT
- Gestion des erreurs standardisée

### Services Externes
- **MediaCMS** : Lecture de vidéos
- **Sentry** : Monitoring des erreurs
- **Google Analytics** : Suivi d'audience

## 5. Bonnes Pratiques

### Développement
- Composants fonctionnels avec hooks
- Typage fort avec TypeScript
- Tests unitaires pour la logique métier
- Tests d'intégration pour les parcours utilisateurs

### Performance
- Code splitting
- Mémoisation des composants coûteux
- Chargement paresseux des images

## 6. Développement Local

### Prérequis
- Node.js 18+
- npm / yarn

### Commandes
```bash
# Installer les dépendances
yarn install

# Démarrer en mode développement
yarn dev

# Lancer les tests
yarn test

# Build pour la production
yarn build

# Vérifier les types TypeScript
yarn type-check
```

## 7. Déploiement

### Environnements
- **Développement** : `http://localhost:3000`
- **Staging** : Environnement de pré-production
- **Production** : CDN + hébergement cloud

### CI/CD
- Tests automatisés à chaque push
- Déploiement automatique sur staging
- Validation manuelle pour la production

## 8. Dépannage

### Problèmes Courants
- **Erreurs CORS** : Vérifier la configuration du proxy
- **Problèmes de types** : Exécuter `yarn type-check`
- **Tests qui échouent** : `yarn test --watch` pour le débogage

## 9. Améliorations Futures
- [ ] Migration vers Next.js pour le SSR
- [ ] Amélioration de l'accessibilité (a11y)
- [ ] Optimisation des performances

## 10. Contacts
- Lead Frontend : [Nom] (email@example.com)
- Design UI/UX : [Nom] (design@example.com)
- Support Technique : support@example.com
