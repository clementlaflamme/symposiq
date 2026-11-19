import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
 
const globalPourPrisma = globalThis as unknown as { prisma: PrismaClient};
 
function creerClient(){
    const adapter = new PrismaPg({
        connectionString : process.env.DATABASE_URL
    });
    return new PrismaClient({ adapter });
}
 
export const prisma = globalPourPrisma.prisma ?? creerClient;
 
if (process.env.NODE_ENV !== "production"){
    globalPourPrisma.prisma = prisma;
}