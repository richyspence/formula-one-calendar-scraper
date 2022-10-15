import { RaceCalendar } from "./interfaces/race";
import { getCalendarData } from "./scraper/calendarScraper";

const RACE_YEARS: number[] = [2020, 2021, 2022];
const RACE_CALENDARS: RaceCalendar[] = [];

async function startDataIngestion() {

    for (let i = 0; i < RACE_YEARS.length; i++) {
        const year = RACE_YEARS[i];

        console.log(`Starting scrape for year ${year}`);
        const stages = await getCalendarData(year);

        console.log(`Retrieved stage data for year ${year}`);
        RACE_CALENDARS.push({
            year,
            totalStages: stages.length,
            stages,
        });
    }

    RACE_CALENDARS.forEach((calendar) => {
        console.log('==========================');
        console.log(`##### YEAR: ${calendar.year} #####`);
        calendar.stages.forEach(currentStage => {
            console.log(`ROUND: ${currentStage.stage}`);
            console.log(`LOCATION: ${currentStage.location}`);
            console.log(`RUNNING BETWEEN ${currentStage.startAt.toLocaleDateString()} - ${currentStage.endAt.toLocaleDateString()}`);
            console.log('');
        });
    })
}

startDataIngestion();