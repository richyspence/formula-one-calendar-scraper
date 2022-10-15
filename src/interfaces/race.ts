export interface RaceStage {
    stage: number;
    location: string;
    startAt: Date;
    endAt: Date;
}

export interface RaceCalendar {
    year: number;
    totalStages: number;
    stages: RaceStage[];
}