import { EventEmitter } from "stream";
import { DetailedRaceStage, RaceCalendar } from "./interfaces/race";
import { getCalendarData, getStageDetails } from "./scraper/calendarScraper";
import { createCalendar } from "./services/calendarService";
import { createMultipleStages } from "./services/stageService";

const RACE_YEARS: number[] = [2020, 2021, 2022];

EventEmitter.setMaxListeners(30);

async function startDataIngestion() {

    for (let i = 0; i < RACE_YEARS.length; i++) {
        const year = RACE_YEARS[i];

        console.log(`>> Starting scrape for F1 calendar [${year}]`);
        
        const stages = await getCalendarData(year);
        
        console.log(`>> Retrieved basic stage info [${year}]`);
        console.log(`>> Creating calendar in db [${year}]`);
        
        const calendarId = await createCalendar(year, stages.length);
        
        console.log(`>> Created calendar [${year}]`);
        console.log(`>> Creating stages in db [${year}]`);

        await createMultipleStages(stages, calendarId);
        
        console.log(`>> Created stages for calendar [${year}]`);

        const detailedStages: DetailedRaceStage[] = await Promise.all(stages.map(async (currentStage) => {
            const detailedData = await getStageDetails(currentStage.detailsLink);

            return {
                stage: currentStage.stage,
                location: currentStage.location,
                startAt: currentStage.startAt,
                endAt: currentStage.endAt,
                days: detailedData,
            };
        }));

        console.log(`>> Completed data scrape [${year}]`);
    }
}

startDataIngestion();