# Diagramme de classes — SymposiQ

Diagramme conceptuel des données de SymposiQ (voir aussi `docs/cahier-des-charges.md`, section 9).

```mermaid
classDiagram
  class User {
    String id
    String clerkId
    String email
    Role role
    String studentEmail
    String stripeCustomerId
  }
  class Event {
    String id
    String title
    DateTime startsAt
    String location
    Int capacity
    Int seatsTaken
    Int priceCents
    Int studentPriceCents
    EventStatus status
  }
  class Order {
    String id
    OrderStatus status
    Int subtotalCents
    Int discountCents
    Int tpsCents
    Int tvqCents
    Int totalCents
    DateTime reservedUntil
    String stripeSessionId
  }
  class OrderItem {
    TicketType ticketType
    Int quantity
    Int unitPriceCents
    String eventTitle
  }
  class Refund {
    String id
    Int amountCents
    RefundStatus status
    String reason
    String stripeRefundId
  }
  class Subscription {
    String id
    SubStatus status
    String stripeSubscriptionId
    DateTime currentPeriodEnd
    Boolean cancelAtPeriodEnd
    DateTime graceUntil
  }
  class Plan {
    String id
    String name
    Int monthlyPriceCents
    Int trialDays
    String stripePriceId
  }
  class PromoCode {
    String id
    String code
    Int percentOff
    Int maxUses
    Int usedCount
    DateTime expiresAt
  }
  class WebhookEvent {
    String id
    String type
    DateTime receivedAt
  }

  class Role {
    <<enumeration>>
    PARTICIPANT
    ORGANIZER
    ADMIN
  }
  class OrderStatus {
    <<enumeration>>
    PENDING
    PAID
    CANCELED
    REFUNDED
  }
  class SubStatus {
    <<enumeration>>
    TRIALING
    ACTIVE
    PAST_DUE
    UNPAID
    CANCELED
    INCOMPLETE
  }
  class EventStatus {
    <<enumeration>>
    DRAFT
    PUBLISHED
    CANCELED
  }
  class TicketType {
    <<enumeration>>
    REGULAR
    STUDENT
  }
  class RefundStatus {
    <<enumeration>>
    REQUESTED
    APPROVED
    REJECTED
    COMPLETED
  }

  User "1" --> "*" Order : passe
  User "1" --> "*" Event : organise
  User "1" --> "0..1" Subscription : a
  Subscription "*" --> "1" Plan : concerne
  Order "1" *-- "1..*" OrderItem : contient
  OrderItem "*" --> "1" Event : concerne
  Order "1" --> "*" Refund : a
  Event "1" --> "*" PromoCode : propose
  Order "*" --> "0..1" PromoCode : utilise
```

## Attributs facultatifs

Les attributs suivants peuvent être vides (`?` dans Prisma) :
- `User.studentEmail`, `User.stripeCustomerId`
- `Event.studentPriceCents`
- `Order.stripeSessionId`
- `Refund.stripeRefundId`
- `Subscription.graceUntil`

## Identifiants uniques

- `User.clerkId`, `User.email`, `User.stripeCustomerId`
- `Order.stripeSessionId`
- `Subscription.stripeSubscriptionId` ; un seul abonnement par utilisateur
- `Plan.stripePriceId`
- `PromoCode.code` (unique pour un même événement)
- `Refund.stripeRefundId`
- Un même événement n'apparaît qu'une fois par type de billet dans une commande

## Choix de modélisation

- **Montants en cents** (`Int`) partout : aucun nombre à virgule pour l'argent.
- **Snapshot** : `OrderItem.unitPriceCents` et `OrderItem.eventTitle` sont copiés au moment de l'achat et ne changent plus (RM-07).
- **Composition** `Order` → `OrderItem` : supprimer une commande supprime ses lignes.
- Un utilisateur supprimé est **anonymisé** ; ses commandes sont conservées pour la comptabilité (ENF-04).
- **OrderItem** est la table de jonction de la relation plusieurs-à-plusieurs entre `Order` et `Event`.
- **Identifiants Stripe** stockés pour relier la base de données au tableau de bord Stripe.
- **Héritage** Participant / Organisateur remplacé par le champ `role` (énumération).
- **seatsTaken** est mis à jour dans la même transaction que la commande (RM-01).
- **WebhookEvent** n'a aucune relation : il sert à ignorer les webhooks déjà traités (RM-14).
