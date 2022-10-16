import { PrismaClient, Team } from "@prisma/client";

const prisma = new PrismaClient();

export async function createTeam(name: string, logoUrl: string): Promise<number> {
    let teamId: number;
    const specifiedTeam = await getTeamByName(name);

    if (specifiedTeam !== null) {
        await prisma.team.update({
            where: {
                id: specifiedTeam.id,
            },
            data: {
                name: name,
                logo_url: logoUrl,
            },
        });

        teamId = specifiedTeam.id;
    } else {
        const createdTeam = await prisma.team.create({
            data: {
                name: name,
                logo_url: logoUrl,
            },
        });

        teamId = createdTeam.id;
    }

    return teamId;
}

export async function getTeamByName(name: string): Promise<Team | null> {
    return await prisma.team.findFirst({
        where: {
            name: name,
        },
    });
}