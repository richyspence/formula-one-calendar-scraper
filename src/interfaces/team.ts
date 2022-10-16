export interface Team {
    name: string;
    logoUrl: string;
    drivers: Driver[];
}

export interface Driver {
    firstName: string;
    lastName: string;
}