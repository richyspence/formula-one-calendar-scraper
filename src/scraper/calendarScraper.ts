import axios, { AxiosInstance } from "axios";
import { RaceStage } from "../interfaces/race";
import cheerio from "cheerio";
import { getMonthFromString } from "../utils/date";

const TARGET_URL: string = 'https://www.formula1.com/en/racing/';
const BLACKLISTED_TERMS: string[] = ['TESTING', 'ESPORTS'];

const httpClient: AxiosInstance = axios.create();

export async function getCalendarData(targetYear: number) {
    const response = await httpClient.get(TARGET_URL.concat(targetYear.toString(), '.html'));

    if(response.status !== 200) {
        throw new Error(`Could not retrieve page contents for year ${targetYear}`);
    }

    if (response.data === undefined || response.data === null) {
        throw new Error(`No page data for the year ${targetYear}`);
    }

    return getRacingStages(response.data);
}

function getRacingStages(html: string): RaceStage[] {
    if (html === undefined || html === null) {
        throw new Error('No HTML provided');
    }

    let scheduleYear: number | undefined;
    const raceStages: RaceStage[] = [];

    const $ = cheerio.load(html);
    const races: cheerio.Cheerio = $('.event-item');

    races.each((i, element) => {
        const currentRound: string = $(element).find('.card-title').text();

        if (BLACKLISTED_TERMS.some((term) => currentRound.includes(term))) {
            return;
        }

        if (scheduleYear === undefined) {
           scheduleYear = getCurrentRaceYear($, element);
        }

        const currentLocation: string = $(element).find('.event-place').text().trim();

        const currentStartingDay: number = parseInt($(element).find('.date-month > p > .start-date').text());
        const currentEndingDay: number = parseInt($(element).find('.date-month > p > .end-date').text());
        const currentMonth: string = $(element).find('.month-wrapper').text();

        let [startingDate, endingDate] = getStageStartEndDates(currentStartingDay, currentEndingDay, currentMonth, scheduleYear);

        raceStages.push({
            stage: parseInt(currentRound.replace('ROUND', '').trim()),
            location: currentLocation,
            startAt: startingDate,
            endAt: endingDate,
        });
    });

    return raceStages;
}

function getCurrentRaceYear($: cheerio.Root, element: cheerio.Element): number {
    const raceTitle = $(element).find('.event-title.f1--xxs').text().split(' ');
    return parseInt(raceTitle[raceTitle.length - 1]);
}

function getStageStartEndDates(start: number, end: number, month: string, year: number): Date[] {
    if (month.includes('-')) {
        const months: (number | undefined)[] = month.split('-').map((currentMonth) => getMonthFromString(currentMonth));

        let [startingMonth, endingMonth] = months;

        if (startingMonth === undefined || endingMonth === undefined) {
            throw Error('Could not calculate an appropriate month value');
        }

        return [
            new Date(year, startingMonth, start, 0, 0, 0),
            new Date(year, endingMonth, end, 23, 59, 59),
        ];
    }

    const convertedMonth = getMonthFromString(month);

    if (convertedMonth === undefined) {
        throw Error('Could not calculate an appropriate month value');
    }

    return [
        new Date(year, convertedMonth, start, 0, 0, 0),
        new Date(year, convertedMonth, 23, 59, 59),
    ];
}

