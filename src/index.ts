import { EventEmitter } from "stream";
import { DetailedRaceStage, RaceCalendar } from "./interfaces/race";
import { getCalendarData, getStageDetails } from "./scraper/calendarScraper";

const RACE_YEARS: number[] = [2022];
const RACE_CALENDARS: RaceCalendar[] = [];

EventEmitter.setMaxListeners(30);

async function startDataIngestion() {

    for (let i = 0; i < RACE_YEARS.length; i++) {
        const year = RACE_YEARS[i];

        console.log(`Starting scrape for year ${year}`);
        const stages = await getCalendarData(year);

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

        console.log(`Retrieved stage data for year ${year}`);
        RACE_CALENDARS.push({
            year,
            totalStages: stages.length,
            stages: detailedStages,
        });
    }

    RACE_CALENDARS.forEach((calendar) => {
        console.log('==========================');
        console.log(`##### YEAR: ${calendar.year} #####`);
        calendar.stages.forEach(currentStage => {
            console.log(`ROUND: ${currentStage.stage}`);
            console.log(`LOCATION: ${currentStage.location}`);
            console.log(`RUNNING BETWEEN: ${currentStage.startAt.toLocaleDateString()} - ${currentStage.endAt.toLocaleDateString()}`);
            
            currentStage.days.forEach(day => {
                console.log(`DAY: ${day.date.toLocaleDateString()}`);
                console.log(`TYPE: ${day.type}`);
            });

            console.log('==========================');
            console.log('');
        });
    })
}

startDataIngestion();