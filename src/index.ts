import axios, { AxiosInstance } from 'axios';
import cheerio from 'cheerio';
import { RaceStage } from './interfaces/raceStage';
import { getMonthFromString } from './utils/date';


const TARGET_SCRAPER_URL: string = 'https://www.formula1.com/en/racing/2020.html';
const axiosInstance: AxiosInstance = axios.create();
const BLACKLISTED_TERMS: string[] = ['TESTING', 'ESPORTS'];

axiosInstance.get(TARGET_SCRAPER_URL)
    .then(
        response => {
            getRaceStages(response.data);
        }
    )
    .catch(console.error);

function getRaceStages(html: string): void {
    if (html === undefined || html === null) {
        console.log('No HTML provided.');
    }

    const $ = cheerio.load(html);
    const originalRaceStages: cheerio.Cheerio = $('.event-item');

    let scheduleYear: number | undefined;
    const raceStages: RaceStage[] = [];

    originalRaceStages.each((i, element) => {
        const stage: string = $(element).find('.card-title').text();

        if (BLACKLISTED_TERMS.some((term) => stage.includes(term))) {
            return;
        }

        if (scheduleYear === undefined) {   
            const raceTitle = $(element).find('.event-title.f1--xxs').text().split(' ');
            scheduleYear = parseInt(raceTitle[raceTitle.length - 1]);
        }

        const location: string = $(element).find('.event-place').text().trim();
        const startDay: number = parseInt($(element).find('.date-month > p > .start-date').text());
        const endDay: number = parseInt($(element).find('.date-month > p > .end-date').text());
        const month: string = $(element).find('.month-wrapper').text();

        const stageDates = calculateStageStartAndEnd(startDay, endDay, month, scheduleYear);

        raceStages.push({
            stage: parseInt(stage.replace('ROUND', '').trim()),
            location,
            startAt: stageDates[0],
            endAt: stageDates[1],
        });
    });

    raceStages.forEach((stage) => console.log(stage));
}

function calculateStageStartAndEnd(startDay: number, endDay: number, month: string, year: number): Date[] {
    if (month.includes('-')) {
        const months: string[] = month.split('-');
        const startMonth: number | undefined = getMonthFromString(months[0]);
        const endMonth: number | undefined = getMonthFromString(months[1]);

        if (startMonth === undefined || endMonth === undefined) {
            throw Error('Could not calculate appropriate month value');
        }

        return [
            new Date(year, startMonth, startDay, 0, 0, 0),
            new Date(year, endMonth, endDay, 23, 59, 59),
        ];
    } else {
        const convertedMonth = getMonthFromString(month);

        if (convertedMonth === undefined) {
            throw Error('Could not calculate appropriate month value');
        }

        return [
            new Date(year, convertedMonth, startDay, 0, 0, 0),
            new Date(year, convertedMonth, endDay, 23, 59, 59),
        ];
    }
}