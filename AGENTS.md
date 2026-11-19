# AGENTS.md

# Symposiq

Plateforme web de gestion de congres et de journees scientifiques

- participants: achetent des billets (paiement unique, Stripe Checkout)
- Organisateurs: plan Pro Mensuel a 29$ avant taxes, essai de 14 jours (abonnement, Stripe Billing)
- cahier des charges : @docs/cahier-des-charges.md (identifiants US-xx, RM-xx, ENF-xx)
- Diagramme de classes : @docs/classes.md

# Stack

Next.js (App Router, TypeScript strict) . Tailwind . Prisma + PostgreSQL (Neon) . Clerk . Stripe . Zod . Vitest

# commandes

- `npm run dev` : serveur de developpement
- `npm test` : tests Vitest, a lancer apres chaque modifications.
- `npm run lint` et `npm run build` : doivent passer avant chaque commit
- `npx prisma validate` : Apres toute modification de `prisma/schema.prisma`

# Structure

- `app/` : pages et Route Handlers (`app/api/.../route.ts`) ; `app/actions/` Server Actions
- `lib/` : logique metier pure et testee (taxes, prix, acces) ; tests a cote : `lib/*.test.ts`
- `prisma/schema.prisma` : modele de donnees
- `docs/` : cahier des charges, diagramme de classes, journal IA

# Regles metier (cahier des charges)

- RM-01 Capacite jamais depassee : reservation dans une transaction prisma
- RM-07 Prix unitaire et titre copies dans `OrderItem` a l'achat
- RM-08 Un organisateur ne voit et ne modifie que ses propres événements, commandes et revenus (verifie cote serveur)
- RM-12 Le prix d'une commande est toujours recalculé par le serveur depuis la BD
- RM-13 TPS 5 % et TVQ 9,975 % sont calculées en cents sur le montant après rabais, arrondies taxe par taxe.
- RM-14 Un webhook Stripe deja traite est ignore
- RM-15 Commande `PAID` UNIQUEMENT a la reception d'un webhook stripe a signature valide

# Interdits

- Jamais de `Float` ni `Decimal` pour l'argent : `Int` en cents
- Jamais de chaine libre pour un statut : `enum` Prisma
- jamais `prisma migrate reset`, `git push --force`, `git reset --hard` sans mon accord
- jamais de numero de carte, CVV ou cle secrete en BD ou dans le code
- Jamais lire ni afficher `.env` (utiliser `.env.example` pour les noms de variables)
- Jamais nouveau paquet npm sans me demander

# Facon de travailler

- Propose un plan avant de coder ; une tache a la fois
- Apres chaque modification : `npm test` et `npm run lint`
- Commit : `type : US-xx description` (feat, update, docs, chore, test, fix)
- Reponds en francais
- Si une regle metier ou un nom de champ manque : pose la question, NE DEVINE PAS.
