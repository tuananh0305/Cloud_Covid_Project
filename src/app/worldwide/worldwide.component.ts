import { Component, OnInit } from '@angular/core';
import { SummaryData, CountryData, DayoneWorldData } from '../models/model'
import { MainService } from '../main.service'
import { DatePipe } from '@angular/common';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
// import {MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-worldwide',
  templateUrl: './worldwide.component.html',
  styleUrls: ['./worldwide.component.css']
})
export class WorldwideComponent implements OnInit {

  summaryData: SummaryData;
  arrayDate: Date [];
  currentDate: Date;
  countriesData: Array<CountryData>;
  cumulativeWorldData: Array<DayoneWorldData>;

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


  constructor(public service: MainService, public datepipe: DatePipe) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

  ngOnInit(): void {  
    this.getSummaryData();
    this.getCumulativeWorldData();
    
  }

  getSummaryData() {
    this.service.getSummaryData().subscribe(
    response => {
    this.summaryData = response;
    this.plotPieChart();
    this.getCountriesData();
    }
    )
  }


  plotPieChart() {
    this.pieChartOptions = {
      responsive: true,
    };
    this.pieChartLabels= ['Dead Cases', 'Recovered Cases', 'Active Cases'];
    this.pieChartData = [this.summaryData.Global.TotalDeaths, this.summaryData.Global.TotalRecovered, this.summaryData.Global.TotalConfirmed-this.summaryData.Global.TotalRecovered];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
    this.pieChartReady = true;
  }

  getCumulativeWorldData(){
    this.service.getCumulativeWorldData().subscribe(
      response => {
      this.cumulativeWorldData = response.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed);
      this.plotBarChart();
      this.plotLineChart();
      }
    )
  }

  plotBarChart(){
    var barChartLabels = [];
    var Daily_Deaths = [];
    var Daily_Recovered = [];
    var Daily_New_Cases = [];
    for (let i = this.cumulativeWorldData.length -7; i < this.cumulativeWorldData.length; i++){
      // barChartLabels.push(i);
      Daily_Deaths.push(this.cumulativeWorldData[i].NewDeaths);
      Daily_Recovered.push(this.cumulativeWorldData[i].NewRecovered);
      Daily_New_Cases.push(this.cumulativeWorldData[i].NewConfirmed);
    }

    // create array of date as label
    let date = new Date();
    let endDate = new Date();
    endDate.setDate(date.getDate() - 1);
    let initialDate = new Date();
    initialDate.setDate(date.getDate() - 7);
    for (let d = initialDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      barChartLabels.push(this.datepipe.transform(d).split(',')[0]);
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

    // create array of date as label
    let date = new Date();
    let endDate = new Date();
    endDate.setDate(date.getDate() - 1);
    let initialDate = new Date("2020-05-13");
    for (let d = initialDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      lineChartLabels.push(this.datepipe.transform(d).split(',')[0]);
    }
    var n = lineChartLabels.length;

    for (let i = this.cumulativeWorldData.length - n; i < this.cumulativeWorldData.length; i++){
      // lineChartLabels.push(this.datepipe.transform(this.cumulativeWorldData[i].Date).split(',')[0]);
      Total_Deaths.push(this.cumulativeWorldData[i].TotalDeaths);
      Total_Recovered.push(this.cumulativeWorldData[i].TotalRecovered);
      Total_New_Cases.push(this.cumulativeWorldData[i].TotalConfirmed);
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

  getCountriesData(){
    this.countriesData = JSON.parse(JSON.stringify(this.summaryData.Countries));
  }

}