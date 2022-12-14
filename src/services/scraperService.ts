import axios, { AxiosInstance } from "axios";
import puppeteer from "puppeteer";

const CALENDAR_TARGET_URL: string = 'https://www.formula1.com/en/racing/';
const TEAMS_TARGET_URL: string = 'https://www.formula1.com/en/teams.html';
const httpClient: AxiosInstance = axios.create();

export async function getStageData(targetYear: number): Promise<string> {
    const response = await httpClient.get(CALENDAR_TARGET_URL.concat(targetYear.toString(), '.html'));

    if(response.status !== 200) {
        throw new Error(`Could not retrieve page contents for year ${targetYear}`);
    }

    if (response.data === undefined || response.data === null) {
        throw new Error(`No page data for the year ${targetYear}`);
    }

    return response.data;
}

export async function getTeamData(): Promise<string> {
    const response = await httpClient.get(TEAMS_TARGET_URL);

    if (response.status !== 200) {
        throw new Error(`Could not retrieve team page contents`);
    }

    if (response.data === undefined || response.data === null) {
        throw new Error(`No team page data`);
    }

    return response.data;
}

export async function getStageDetailedData(url: string) {
    const browserInstance = await puppeteer.launch();
    const targetPage = await browserInstance.newPage();
    await targetPage.goto(url);
    await targetPage.waitForNetworkIdle({
        idleTime: 0,
    });

    const response = await targetPage.content();

    browserInstance.close();

    if (response === undefined || response === null) {
        throw new Error(`No data for the stage ${url}`);
    }

    return response;
}

