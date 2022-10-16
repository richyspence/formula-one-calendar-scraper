import { DayDetails, DayType, RaceStage } from "../interfaces/race";
import cheerio from "cheerio";
import { getMonthFromString } from "../utils/date";
import { getStageData, getStageDetailedData } from "../services/scraperService";

const BLACKLISTED_TERMS: string[] = ['TESTING', 'ESPORTS'];

export async function getCalendarData(targetYear: number): Promise<RaceStage[]> {
    const calendarData = await getStageData(targetYear);
    return getRacingStages(calendarData);
}

function getRacingStages(html: string): RaceStage[] {
    if (html === undefined || html === null) {
        throw new Error('No HTML provided');
    }

    let scheduleYear: number | undefined;
    const raceStages: RaceStage[] = [];

    const $ = cheerio.load(html);
    const races: cheerio.Cheerio = $('.event-item-wrapper');

    races.each((i, element) => {
        const currentRound: string = $(element).find('.card-title').text();

        if (BLACKLISTED_TERMS.some((term) => currentRound.includes(term))) {
            return;
        }

        if (scheduleYear === undefined) {
           scheduleYear = getCurrentRaceYear($, element);
        }

        const detailsLink: string | undefined = $(element).attr('href');
        
        if (detailsLink === undefined) {
            throw new Error(`A details link was not available for ${currentRound}`);
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
            detailsLink,
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

function getRaceDay(day: number, month: string, year: number): Date {
    const convertedMonth = getMonthFromString(month);

    if (convertedMonth === undefined) {
        throw Error('Could not calculate an appropriate month value');
    }

    return new Date(year, convertedMonth, day, 0, 0, 0);
}

export async function getStageDetails(url: string): Promise<DayDetails[]> {
    const detailedStageData = await getStageDetailedData(url);
    return getStageDayData(detailedStageData);
}

function getDayType(title: string): DayType {
    let specifiedType: DayType;
    switch(title) {
        case "Race":
            specifiedType = DayType.Race;
            break;
        case "Sprint":
            specifiedType = DayType.Sprint;
            break;
        case "Qualifying":
            specifiedType = DayType.Qualifying;
            break;
        case "Practice 1":
            specifiedType = DayType.Practice1;
            break;
        case "Practice 2":
            specifiedType = DayType.Practice2;
            break;
        case "Practice 3":
            specifiedType = DayType.Practice3;
            break;
        default:
            throw new Error('The specified day type is not supported');
    }

    return specifiedType;
}

function getStageDayData(html: string): DayDetails[] {
    if (html === undefined || html === null) {
        throw new Error('No HTML provided');
    }

    const $ = cheerio.load(html);
    const raceDetails: cheerio.Cheerio = $('.f1-timetable--row.f1-bg--white.expandable');
    const days: DayDetails[] = [];

    raceDetails.each((i, element) => {
        const title = $(element).find('.f1-timetable--title').text();
        const day = parseInt($(element).find(".f1-timetable--day").text());
        const month = $(element).find('.f1-timetable--month.f1-bg--gray2.f1-label.f1-color--gray5').text();

        days.push({
            date: getRaceDay(day, month, 2022),
            type: getDayType(title),
        })
    });

    return days;
}