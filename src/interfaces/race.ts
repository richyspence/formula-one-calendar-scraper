export interface RaceStage {
    stage: number;
    location: string;
    startAt: Date;
    endAt: Date;
    detailsLink: string;
}

export type DetailedRaceStage = Omit<RaceStage, "detailsLink"> & {
    days: DayDetails[];
}

export interface RaceCalendar {
    year: number;
    totalStages: number;
    stages: DetailedRaceStage[];
}

export interface DayDetails {
    date: Date;
    type: DayType;
    resultsLink?: string;
}

export enum DayType {
    Race = "Race",
    Qualifying = "Qualifying",
    Sprint = "Sprint",
    Practice3 = "Practice 3",
    Practice2 = "Practice 2",
    Practice1 = "Practice 1",
}