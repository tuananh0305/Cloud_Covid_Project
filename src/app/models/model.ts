export class SummaryData {
    Global: GlobalData;
    Countries: Array<CountryData>;
    Date: Date;
}
export class GlobalData {
    NewConfirmed: number;
    NewDeaths: number;
    NewRecovered: number;
    TotalConfirmed: number;
    TotalDeaths: number;
    TotalRecovered: number
}
export class CountryData extends GlobalData {
    Country: string;
    CountryCode: string;
    Date: Date;
    Slug: string
}
export class DayoneCountryData {
    Confirmed: number;
    Deaths: number;
    Recovered: number;
    Date: Date;
}
export class DayoneWorldData {
    NewConfirmed: number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
}
