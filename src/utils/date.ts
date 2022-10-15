
const MONTH_MAP = new Map<string, number>([
    ["Jan", 0],
    ["Feb", 1],
    ["Mar", 2],
    ["Apr", 3],
    ["May", 4],
    ["Jun", 5],
    ["Jul", 6],
    ["Aug", 7],
    ["Sep", 8],
    ["Oct", 9],
    ["Nov", 10],
    ["Dec", 11],
]);

export function getMonthFromString(month: string): number | undefined {
    if (month === undefined || month === null) {
        return;
    }

    return MONTH_MAP.get(month);
}