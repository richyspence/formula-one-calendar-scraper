import { PrismaClient, Stage } from "@prisma/client";
import { RaceStage } from "../interfaces/race";

const prisma = new PrismaClient();

export async function createMultipleStages(stages: RaceStage[], calendarId: number) {
    const mappedStages = stages.map((currentStage) => {
        return {
            title: `Round ${currentStage.stage}`,
            starts_on: currentStage.startAt,
            ends_on: currentStage.endAt,
            details_url: currentStage.detailsLink,
            calendar_id: calendarId,
        }
    });

    mappedStages.forEach(async (stage) => {
        const specifiedStage = await getStageByRoundAndCalendar(stage.title, calendarId);

        if (!specifiedStage) {
            await prisma.stage.create({
                data: stage,
            });
        } else {
            await prisma.stage.update({
                where: {
                    id: specifiedStage.id,
                },
                data: stage,
            });
        }
    });
}

export async function getStageByRoundAndCalendar(stage: string, calendarId: number): Promise<Stage | null> {
    return await prisma.stage.findFirst({
        where: {
            title: stage,
            calendar_id: calendarId,
        },
    });
}