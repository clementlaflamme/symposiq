import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const JOUR = 24 * 60 * 60 * 1000;
const dans = (jours: number) => new Date(Date.now() + jours * JOUR);

async function main() {
  await prisma.$transaction([
    prisma.refund.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.promoCode.deleteMany(),
    prisma.event.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.plan.deleteMany(),
    prisma.user.deleteMany(),
    prisma.webhookEvent.deleteMany(),
  ]);

  const pro = await prisma.plan.create({})
}


