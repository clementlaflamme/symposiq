---
name: revue-paiement
description: Relit les changements non commités liés au panier, au paiement, aux taxes ou aux webhooks Stripe et signale les violations des règles métiers de SymposiQ. À utiliser avant un commit qui touche à Stripe, les prix ou les commandes.
disable-model-invocation: true
allowed-tools: Read, Grep, autre au besoin.
---

## Changements à relire
`git diff HEAD`

## Ce que tu dois vérifier
Relis uniquement les changements ci-dessus (et les fichiers qu'ils touchent indirectement si nécessaire)
Pour chaque point, réponds **OK**, **À CORRIGER** (avec le fichier et la ligne correspondante) ou **NON CONCERNÉ**:

1. **RM-13**: TPS 5% et TVQ 9,975% calculées sur le montant après rabais, arrondies taxe par taxe ?
2. **RM-12**: Le montant envoyé à Stripe vient-il de la base de données et jamais du formulaire ou de l'URL ?
3. **Argent**: Tous les montants sont-ils des entiers en cents (`Int`) sans `Float`, `Decimal` ni `parseFloat` ?
4. **RM-07**: Le prix et le nom de l'événement sont-ils copiés dans `OrderItem` au moment de l'achat ?
5. **RM-14**: Un même événement Stripe (webhook) est-il déjà traité ?
6. **RM-15**: Une commande ne passe-t-elle à `PAID` que dans le webhook, après vérification de la signature ?
7. **Validation**: Les entrées du client sont-elles validées côté serveur  ?
8. **Secrets**: Aucune clé, aucun `console.log(process.env)`, aucun numéro de carte ?

Termine par un résumé en une ligne: `X point à CORRIGER`
Ne modifie aucun fichier, tu fais simplement une revue, pas une correction.
Si le diff est vide, dis simplement qu'il n'y a aucun changement à relire.
