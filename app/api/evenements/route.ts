import { prisma } from "@/lib/prisma"
 
type NouvelEvenementRecu = {
    title: string;
    capacity: number;
    location: string;
    price: string;
    startAt: string;
}
 
// POST /api/evenemnts
export async function POST(request: Request){
    const corps = (await request.json()) as NouvelEvenementRecu;
    const {price, ...reste} = corps;
    const organisateur = await prisma.organisateur.findUniqueOrThrow({where: {email: "exemple@test.com"}});
 
    const evenement = await prisma.event.create({
        data: {
            ...reste,
            priceCents : Math.round(Number(price) * 100),
            organizerId: organisateur.id,
        }
    })
 
    return Response.json(evenement, {status: 201});
 
}