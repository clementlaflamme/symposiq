---
paths: 
  - "app/api/webhooks/*"
  - "app/actions/checkout"
  - "lib/stripe*"
---

# Règles pour le code de paiement

- Vérifier la signature de chaque webhook et le secret `STRIPE_WEBHOOK_SECRET` (RM-15)
- Le montant envoyé à Stripe vient toujours de la base de données (RM-12)
