import { EventEmitter } from "stream";
import { DetailedRaceStage, RaceCalendar } from "./interfaces/race";
import { getCalendarData, getStageDetails } from "./scraper/calendarScraper";
import { getRaceTeamData } from "./scraper/teamScraper";
import { createCalendar } from "./services/calendarService";
import { createDriver } from "./services/driverService";
import { createMultipleStages } from "./services/stageService";
import { createTeam } from "./services/teamService";

const RACE_YEARS: number[] = [2020, 2021, 2022];

EventEmitter.setMaxListeners(30);

async function startCalendarIngestion() {

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
    }
}

async function startTeamIngestion() {
    console.log('>> Starting scrape for F1 Team data');

    const racingTeams = await getRaceTeamData();

    console.log('>> Retrieved scrape of team data');
    console.log('>> Creating teams in db');

    racingTeams.forEach(async (team) => {
        const { name, logoUrl } = team;
        const teamId = await createTeam(name, logoUrl);

        console.log(`>> Creating drivers for ${team.name} in db`);

        team.drivers.forEach(async (driver) => {
            const { firstName, lastName } = driver;
            await createDriver(firstName, lastName, teamId);
        });

        console.log(`>> Drivers have been created in db for ${team.name}`);
    });

    console.log('>> Team scrape is complete');
}

startCalendarIngestion();
startTeamIngestion();