import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
  private url_summary: string = "https://api.covid19api.com/summary";
  private url_dayone_world: string = "https://api.covid19api.com/world";
  private url_dayone_country: string = "https://api.covid19api.com/total/dayone/country/";
  public selectedCountry: String;

  getSummaryData(): Observable<any> {
    return this.http.get(this.url_summary)
    .pipe((response) => response);
  }

  getCumulativeWorldData(): Observable<any> {
    return this.http.get(this.url_dayone_world)
    .pipe((response) => response);
  }

  getCumulativeCountryData(country: String): Observable<any> {
    return this.http.get(this.url_dayone_country + country)
    .pipe((response) => response);
  }

}
