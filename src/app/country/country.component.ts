import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../main.service'
import { SummaryData, CountryData, DayoneCountryData } from '../models/model'
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  public selectedCountry: String;
  private sub: any;
  cumulativeCountryData: Array<DayoneCountryData>;
  summaryData: SummaryData;
  selectedCountryData: CountryData;

  // Pie chart
  public pieChartOptions: ChartOptions ;
  public pieChartLabels: Label[] ;
  public pieChartData: number[] ;
  public pieChartType: ChartType ;
  public pieChartLegend ;
  public pieChartPlugins ;
  public pieChartReady: Boolean;

  // Bar chart
  public barChartOptions: ChartOptions;
  public barChartLabels: Label[];
  public barChartType: ChartType;
  public barChartLegend ;
  public barChartPlugins;
  public barChartData: ChartDataSets[];
  public barChartReady: Boolean;

  // Line chart
  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: ChartOptions;
  public lineChartColors: Color[];
  public lineChartLegend;
  public lineChartType: ChartType;
  public lineChartPlugins = [];
  public lineChartReady: Boolean;

  constructor(private route: ActivatedRoute, public service: MainService, public datepipe: DatePipe) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {this.selectedCountry = params['slug']; })
    this.getSummaryData();
  }

  getSummaryData() {
    this.service.getSummaryData().subscribe(
    response => {
    this.summaryData = response;
    this.selectedCountryData = this.summaryData.Countries.find(country => country.Slug == this.selectedCountry);
    this.plotPieChart();
    this.getCumulativeCountryData(this.selectedCountry);
    }
    )
  }

  plotPieChart() {
    this.pieChartOptions = {
      responsive: true,
    };
    this.pieChartLabels= ['Dead Cases', 'Recovered Cases', 'Active Cases'];
    this.pieChartData = [this.selectedCountryData.TotalDeaths, this.selectedCountryData.TotalRecovered, this.selectedCountryData.TotalConfirmed];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
    this.pieChartReady = true;
  }

  plotBarChart(){
    var barChartLabels = [];
    var Daily_Deaths = [];
    var Daily_Recovered = [];
    var Daily_New_Cases = [];
    for (let i = this.cumulativeCountryData.length -7; i < this.cumulativeCountryData.length; i++){
      barChartLabels.push(this.datepipe.transform(this.cumulativeCountryData[i].Date).split(',')[0]);
      Daily_Deaths.push(this.cumulativeCountryData[i].Deaths - this.cumulativeCountryData[i-1].Deaths);
      Daily_Recovered.push(this.cumulativeCountryData[i].Recovered - this.cumulativeCountryData[i-1].Recovered);
      Daily_New_Cases.push(this.cumulativeCountryData[i].Confirmed - this.cumulativeCountryData[i-1].Confirmed);
    }


    this.barChartOptions = {
      responsive: true,
    };
    this.barChartLabels = barChartLabels;
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartPlugins = [];
  
    this.barChartData = [
      { data: Daily_Deaths, label: 'Daily Deaths' },
      { data: Daily_Recovered, label: 'Daily Recovered' },
      { data: Daily_New_Cases, label: 'Daily New Cases' }
    ];
    this.barChartReady = true;
  }

  plotLineChart(){
    var lineChartLabels = [];
    var Total_Deaths = [];
    var Total_Recovered = [];
    var Total_New_Cases = [];
    for (let i = 0; i < this.cumulativeCountryData.length; i++){
      lineChartLabels.push(this.datepipe.transform(this.cumulativeCountryData[i].Date).split(',')[0]);
      Total_Deaths.push(this.cumulativeCountryData[i].Deaths);
      Total_Recovered.push(this.cumulativeCountryData[i].Recovered);
      Total_New_Cases.push(this.cumulativeCountryData[i].Confirmed);
    }

    this.lineChartData = [
      { data: Total_Deaths, label: 'Total Deaths' },
      { data: Total_Recovered, label: 'Total Recovered' },
      { data: Total_New_Cases, label: 'Total New Cases' }
    ];
    this.lineChartLabels = lineChartLabels;
    this.lineChartOptions = {
      responsive: true,
    };
    this.lineChartColors = [
      {
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ];
    this.lineChartLegend = true;
    this.lineChartType = 'line';
    this.lineChartPlugins = [];
    this.lineChartReady = true;
  }

  getCumulativeCountryData(country: String){
    this.service.getCumulativeCountryData(country).subscribe(
      response => {
      this.cumulativeCountryData = response;
      this.plotBarChart();
      this.plotLineChart();
    }
    )
  }

}
