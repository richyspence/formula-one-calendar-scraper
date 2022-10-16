import { Driver, Team } from "../interfaces/team";
import { getTeamData } from "../services/scraperService";
import cheerio from "cheerio";

export async function getRaceTeamData(): Promise<Team[]> {
    const teamData = await getTeamData();
    return getTeams(teamData);
}

function getTeams(html: string): Team[] {
    if (html === undefined || html === null) {
        throw new Error('No HTML provided');
    }
    
    const racingTeams: Team[] = [];

    const $ = cheerio.load(html);
    const teams: cheerio.Cheerio = $('.listing-item-wrapper');

    teams.each((i, element) => {
        const teamName = $(element).find('.name.f1-bold--m > span').next().text();
        const drivers: Driver[] = [];

        const driverSections = $(element).find('.driver-info');

        driverSections.each((j, element) => {
            let [firstName, lastName] = $(element).find('span')
                .text()
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .split(' ');

            drivers.push({
                firstName,
                lastName,
            });
        });

        const teamLogo = $(element).find('.team-car > img').attr('data-src') ?? '';

        racingTeams.push({
            name: teamName,
            drivers,
            logoUrl: teamLogo,
        });
    });

    return racingTeams;
}