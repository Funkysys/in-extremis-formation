# Administration - Documentation

Ce dossier contient tous les composants et pages nécessaires pour l'administration de la plateforme In Extremis Formation.

## Architecture

### Pages

#### `/admin/dashboard`

**Tableau de bord administrateur**

- Vue d'ensemble des statistiques principales
- Métriques : utilisateurs, vidéos, paiements, revenus
- Taux de conversion et indicateurs clés
- Navigation rapide vers les autres sections
- Dernières activités

**Statistiques affichées :**

- Utilisateurs totaux / actifs / premium / inactifs
- Vidéos totales / publiées / premium / brouillons
- Paiements réussis / en attente / échoués
- Revenu total et moyen par paiement
- Taux de conversion (users → premium, paiements, publications)

#### `/admin/users`

**Gestion des utilisateurs**

- Liste complète de tous les utilisateurs
- Recherche par email ou nom
- Filtres : tous / actifs / inactifs / premium
- Actions par utilisateur :
  - Activer / Désactiver le compte
  - Attribuer / Retirer le statut Premium
  - Attribuer / Retirer les droits Admin
  - Supprimer l'utilisateur
- Affichage des informations : nom, email, statut, type, date de création

#### `/admin/videos`

**Modération des vidéos**

- Grille de toutes les vidéos (thumbnail, titre, durée)
- Recherche par titre ou description
- Filtres : toutes / publiées / non publiées / premium
- Actions par vidéo :
  - Publier / Dépublier
  - Définir Premium / Gratuit
  - Approuver (pour les vidéos en attente)
  - Supprimer
- Badges visuels : statut publication, premium, durée

#### `/admin/payments`

**Gestion des paiements**

- Table complète de tous les paiements
- Statistiques rapides : total, réussis, en attente, revenu
- Recherche par email, nom ou description
- Filtres : tous / réussis / en attente / échoués
- Colonnes : ID, utilisateur, description, montant, méthode, statut, date
- Badges colorés selon le statut

### Layout

#### `/admin/layout.tsx`

**Layout principal de l'administration**

- Protection de toutes les routes admin (vérification `isSuperuser`)
- Redirection automatique vers `/formation` si non-admin
- Intégration de la Sidebar
- Fond gris pour toute la zone admin

### Composants

#### `Sidebar.tsx` (mis à jour)

**Barre de navigation latérale**

- Navigation vers :
  - 📊 Dashboard
  - 👥 Utilisateurs
  - 🎥 Vidéos
  - 💰 Paiements
  - 🔐 Rôles (existant)
- Indicateur de page active
- Bouton retour (si dans sous-page)
- Liens rapides :
  - Espace formateur
  - Accueil formations
  - Déconnexion
- Mode collapsible (ouvert/réduit)

## Permissions

### Vérification des droits

Toutes les pages admin vérifient automatiquement :

```tsx
const { user, isLoading } = useAuth();

useEffect(() => {
  if (!isLoading && (!user || !user.isSuperuser)) {
    router.push("/formation");
  }
}, [user, isLoading, router]);
```

### Propriété utilisée

- `user.isSuperuser` : `true` pour les administrateurs
- Définie dans le type `User` du `AuthProvider`

## Mutations GraphQL utilisées

### Utilisateurs

- `UPDATE_USER_MUTATION` : Modifier un utilisateur
- `DELETE_USER_MUTATION` : Supprimer un utilisateur
- Query : `USERS_QUERY` (limit: 1000)

### Vidéos

- `UPDATE_VIDEO_MUTATION` : Modifier une vidéo
- `DELETE_VIDEO_MUTATION` : Supprimer une vidéo
- `MODERATE_VIDEO_MUTATION` : Approuver/rejeter
- `SET_VIDEO_PREMIUM_MUTATION` : Définir statut premium
- Query : `ALL_VIDEOS_QUERY` (limit: 1000)

### Paiements

- Query : `LIST_PAYMENTS_QUERY`
- Query : `USERS_QUERY` (pour afficher les infos utilisateur)

## Fonctionnalités

### Recherche et Filtrage

Toutes les pages d'administration incluent :

- Champ de recherche temps réel
- Filtres par statut
- Affichage du nombre de résultats

### Actions en masse

Les actions sont confirmées par des dialogues natifs :

```tsx
if (confirm("Êtes-vous sûr de vouloir...")) {
  // Action
}
```

### Refresh automatique

Après chaque mutation, les données sont automatiquement rechargées :

```tsx
const [mutation] = useMutation(MUTATION_NAME, {
  onCompleted: () => refetch(),
});
```

### Protection contre auto-suppression

Les admins ne peuvent pas :

- Se supprimer eux-mêmes
- Retirer leurs propres droits admin

```tsx
<button
  disabled={u.id === user.id}
  // ...
>
```

## Styles

### Design System

- **Couleurs principales** :

  - Bleu (`blue-500`) : Actions principales, navigation active
  - Vert (`green-500/600`) : Succès, actif, paiements réussis
  - Orange (`orange-500`) : Premium, warnings
  - Rouge (`red-500`) : Erreurs, suppressions, inactifs
  - Gris (`gray-50/100`) : Fond, états neutres

- **Composants** :
  - Cards blanches avec ombre légère
  - Bordures grises (`border-gray-200`)
  - Boutons avec `hover:` transitions
  - Badges avec `rounded-full` pour les statuts

### Responsive

- Layout adaptatif avec Tailwind CSS
- Grid responsive : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Tables avec overflow horizontal sur mobile
- Sidebar collapsible

## Navigation

### Structure des routes

```
/admin
  ├── /dashboard          (Page principale)
  ├── /users              (Gestion utilisateurs)
  ├── /videos             (Modération vidéos)
  ├── /payments           (Gestion paiements)
  └── /roles              (Gestion rôles - existant)
```

### Liens rapides

Chaque page admin inclut un bouton "← Retour au Dashboard"

## Sécurité

### Protection routes

- Vérification côté client dans le layout
- Redirection automatique si non-autorisé
- Vérification également côté serveur (GraphQL resolvers)

### Tokens

- JWT automatiquement inclus dans les headers GraphQL
- Gestion par Apollo Client (`authLink`)

### Actions sensibles

- Confirmation obligatoire pour suppressions
- Protection contre auto-suppression admin
- Messages d'erreur clairs

## Performance

### Chargement des données

- Queries avec limit élevé (1000) pour admin
- Pagination future si nécessaire
- Loading states avec spinner

### Caching

- Apollo Client cache automatique
- Refetch après mutations
- Pas de polling (économie ressources)

## Améliorations futures

### À implémenter

- [ ] Logs détaillés des actions admin
- [ ] Export CSV/Excel des données
- [ ] Graphiques et analytics avancés
- [ ] Gestion des remboursements
- [ ] Webhooks Mollie pour paiements
- [ ] Notifications email admin
- [ ] Système de permissions granulaires
- [ ] Historique des modifications
- [ ] Recherche avancée avec filtres multiples
- [ ] Actions en masse (sélection multiple)

### Optimisations

- [ ] Pagination réelle (au lieu de limit 1000)
- [ ] Virtual scrolling pour grandes listes
- [ ] Debounce sur recherche
- [ ] Cache côté client plus agressif
- [ ] Web Workers pour calculs lourds

## Tests

Pour tester l'administration :

1. Connectez-vous avec un compte admin (`isSuperuser: true`)
2. Accédez à `/admin/dashboard`
3. Testez chaque section :
   - Dashboard : vérifier les stats
   - Users : activer/désactiver, premium, admin
   - Videos : publier/dépublier, premium
   - Payments : filtrer, rechercher

## Contribution

Lors de l'ajout de nouvelles fonctionnalités admin :

1. Créer la page dans `/app/(formation)/admin/`
2. Ajouter le lien dans `Sidebar.tsx`
3. Vérifier les permissions dans le layout
4. Ajouter les mutations/queries GraphQL nécessaires
5. Implémenter la recherche et les filtres
6. Ajouter les confirmations pour actions sensibles
7. Tester avec un compte non-admin (doit rediriger)
8. Documenter dans ce README
