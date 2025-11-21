# Système de Paiement - Documentation

Ce dossier contient tous les composants et pages nécessaires pour gérer les paiements avec Mollie.

## Architecture

### Services

- **paymentService.ts** (`src/services/paymentService.ts`)
  - Service REST API pour l'intégration avec Mollie
  - Méthodes : `createPayment()`, `getPaymentStatus()`, `isPaymentSuccessful()`, `formatAmount()`, `getStatusMessage()`
  - Gère la création de paiements et la vérification de statut

### Hooks

- **usePayment.ts** (`src/hooks/usePayment.ts`)
  - Hook React pour la gestion des paiements
  - Combine appel REST (Mollie) + mutation GraphQL (base de données)
  - Gère la redirection automatique vers Mollie
  - États : `isProcessing`, `error`
  - Méthodes : `createPayment()`, `checkPaymentStatus()`, `clearError()`

### Composants

#### CheckoutForm

Formulaire de paiement avec :

- Sélection du montant (montants prédéfinis + montant personnalisé)
- Sélection de la méthode de paiement (iDEAL, carte bancaire, Bancontact, PayPal, SOFORT)
- Description du paiement
- Résumé avant soumission
- Gestion des erreurs
- État de traitement avec loader

#### PremiumSubscription

Widget d'abonnement premium affichant :

- **Si utilisateur premium** : Badge "Abonnement Premium Actif" avec liste des avantages et bouton "Gérer mon abonnement"
- **Si utilisateur non-premium** : Call-to-action "Passez au Premium" avec prix (99,99€/an), liste des avantages et bouton "Passer au Premium"

### Pages

#### `/payment/checkout`

Page de paiement avec :

- En-tête explicatif
- Formulaire CheckoutForm
- Support des paramètres URL pré-remplis : `?amount=50&description=Formation XYZ`
- Gestion de l'annulation (retour à la page précédente)

#### `/payment/confirmation`

Page de confirmation après redirection Mollie avec :

- Vérification automatique du statut via `?payment_id=xxx`
- Affichage différencié selon le statut :
  - **paid** : Message de succès, détails du paiement, liens vers profil/formations
  - **failed** : Message d'échec, bouton "Réessayer"
  - **canceled** : Message d'annulation, bouton "Réessayer"
  - **expired** : Message d'expiration, bouton "Créer un nouveau paiement"
  - **checking** : Loader pendant la vérification
  - **unknown** : Message d'erreur avec détails

## Flux de Paiement

1. **Initiation**

   - L'utilisateur clique sur "Passer au Premium" ou accède à `/payment/checkout`
   - Le formulaire CheckoutForm s'affiche avec montant pré-rempli (optionnel)

2. **Création**

   - L'utilisateur sélectionne montant et méthode, puis soumet
   - Hook `usePayment` appelle `paymentService.createPayment()` (REST API)
   - API backend crée le paiement Mollie et retourne `checkout_url`
   - Hook exécute `CREATE_PAYMENT_MUTATION` GraphQL pour sauvegarder en BDD
   - Redirection automatique vers Mollie (`window.location.href = checkout_url`)

3. **Paiement Mollie**

   - L'utilisateur effectue le paiement sur la plateforme Mollie
   - Mollie redirige vers `/payment/confirmation?payment_id=xxx`

4. **Confirmation**

   - Page de confirmation récupère `payment_id` depuis l'URL
   - Hook `usePayment.checkPaymentStatus()` appelle `paymentService.getPaymentStatus()`
   - API backend vérifie le statut auprès de Mollie
   - Affichage du résultat selon le statut (succès/échec/annulation/expiration)

5. **Mise à jour Premium**
   - Si paiement réussi, le backend met à jour `user.is_premium = true`
   - L'utilisateur voit le badge Premium dans son profil
   - Accès aux contenus premium débloqué

## Intégration

### Dans le Profil

```tsx
import { PremiumSubscription } from "@/components/payment/PremiumSubscription";

<PremiumSubscription showUpgradeButton={true} />;
```

### Dans une Page de Formation

```tsx
import Link from "next/link";

<Link href="/payment/checkout?amount=49.99&description=Formation React Avancé">
  <button>Acheter cette formation</button>
</Link>;
```

### Vérification du Statut Premium

```tsx
import { useAuth } from "@/providers/AuthProvider";

const { user } = useAuth();
const isPremium = user?.is_premium;

if (!isPremium) {
  return <PremiumSubscription />;
}
```

## Variables d'Environnement

Assurez-vous que ces variables sont définies dans `.env.local` :

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
```

## Sécurité

- Les tokens JWT sont automatiquement ajoutés aux en-têtes via `authLink` (GraphQL) et dans le service (REST)
- Les paiements sont créés côté serveur pour éviter toute manipulation
- Mollie gère entièrement le flux de paiement sécurisé
- Vérification du statut côté serveur après redirection

## Gestion des Erreurs

Le système gère automatiquement :

- Erreurs réseau
- Erreurs de validation
- Échecs de paiement
- Paiements annulés
- Paiements expirés
- Tokens invalides

Toutes les erreurs sont affichées avec des messages en français et permettent à l'utilisateur de réessayer.

## Tests

Pour tester le système de paiement :

1. Utilisez les modes de test de Mollie
2. Accédez à `/payment/checkout`
3. Sélectionnez un montant et une méthode
4. Vous serez redirigé vers la page de test Mollie
5. Choisissez "Payer" ou "Annuler" pour tester les différents scénarios
6. Vérifiez que la page de confirmation affiche le bon statut

## Roadmap

- [ ] Webhooks Mollie pour mises à jour asynchrones
- [ ] Gestion des remboursements
- [ ] Abonnements récurrents
- [ ] Factures PDF
- [ ] Historique détaillé des paiements
- [ ] Multi-devises
