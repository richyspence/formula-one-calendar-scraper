import { Driver, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createDriver(firstName: string, lastName: string, teamId: number): Promise<void> {
    const specifiedDriver = await getDriverByNameAndTeam(firstName, lastName, teamId);

    if (specifiedDriver !== null) {
        await prisma.driver.update({
            where: {
                id: specifiedDriver.id,
            },
            data: {
                first_name: firstName,
                last_name: lastName,
                team_id: teamId,
            },
        });
    } else {
        await prisma.driver.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                team_id: teamId,
            },
        });
    }
}

export async function getDriverByNameAndTeam(firstName: string, lastName: string, teamId: number): Promise<Driver | null> {
    return await prisma.driver.findFirst({
        where: {
            first_name: firstName,
            last_name: lastName,
            team_id: teamId,
        },
    });
}