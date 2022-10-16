import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createCalendar(year: number, numberOfStages: number): Promise<number> {
    let calendarId: number;

    const specifiedCalendar = await prisma.calendar.findFirst({
        where: {
            year: year,
            number_of_stages: numberOfStages,
        }
    });

    if (specifiedCalendar) {
        await prisma.calendar.update({
            where: {
                id: specifiedCalendar.id,
            },
            data: {
                year: year,
                number_of_stages: numberOfStages,
            }
        });

        calendarId = specifiedCalendar.id;
    } else {
        const createdCalendar = await prisma.calendar.create({
            data: {
                year: year,
                number_of_stages: numberOfStages,
            },
        });

        calendarId = createdCalendar.id;
    }

    return calendarId;
}