import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RACE_DAY_TYPES = [
    { id: 1, name: 'Race' },
    { id: 2, name: 'Qualifying' },
    { id: 3, name: 'Sprint' },
    { id: 4, name: 'Practice 1' },
    { id: 5, name: 'Practice 2' },
    { id: 6, name: 'Practice 3' },
];

async function main() {
    RACE_DAY_TYPES.forEach((type) => {
        prisma.raceDayType.upsert({
            where: {
                id: type.id,
            },
            update: {
                name: type.name,
            },
            create: {
                id: type.id,
                name: type.name,
            },
        });
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });