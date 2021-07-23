import { Component, OnInit } from '@angular/core';
import { Log } from '../logs/log.model';
import { LogsService } from '../logs/logs.service';
import * as HighCharts from 'highcharts';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
    speed: 600
  }

  deptExpense = {
    'Front Desk Department': 0,
    'Human Resource Department': 0,
    'Purchase Department': 0,
    'Sales & Marketing Department': 0
  }
  deptIncome = {
    'Front Desk Department': 0,
    'Human Resource Department': 0,
    'Sales & Marketing Department': 0
  }

  list: Log[]
  expenseList: Log[]
  incomeList: Log[]
  date = new Date()
  monthExpense: number = 0
  monthIncome: number = 0
  totalExpense: number = 0
  totalIncome: number = 0
  expenseDates: number = 1
  incomeDates: number = 1

  constructor(private ls: LogsService) {}

  ngOnInit() {
    this.ls.logs.subscribe(logs => {
      this.list = logs
      this.expenseList = this.list.filter(record => record.logType === 'Expense')
      this.incomeList = this.list.filter(record => record.logType === 'Income')

      if(this.expenseList.length > 0) {
        this.deptExpense = {
          'Front Desk Department': 0,
          'Human Resource Department': 0,
          'Purchase Department': 0,
          'Sales & Marketing Department': 0
        }
        this.monthExpense = 0
        for(var i in this.expenseList.slice(0, -1)) {
          this.totalExpense += this.expenseList[+i].value
          if(this.expenseList[+i].date.getMonth() === this.date.getMonth() && this.expenseList[+i].date.getFullYear() === this.date.getFullYear()) {
            this.monthExpense += this.expenseList[+i].value
            this.deptExpense[this.expenseList[+i].department] += this.expenseList[+i].value
          }
          if(new Date(this.expenseList[+i].date).toDateString() !== new Date(this.expenseList[+i+1].date).toDateString()) {
            this.expenseDates += 1
          }
        }
        this.totalExpense += this.expenseList[this.expenseList.length - 1].value
        if(this.expenseList[this.expenseList.length - 1].date.getMonth() === this.date.getMonth() && this.expenseList[this.expenseList.length - 1].date.getFullYear() === this.date.getFullYear()) {
          this.monthExpense += this.expenseList[this.expenseList.length - 1].value
          this.deptExpense[this.expenseList[this.expenseList.length - 1].department] += this.expenseList[this.expenseList.length - 1].value
        }
      }

      if(this.incomeList.length > 0) {
        this.deptIncome = {
          'Front Desk Department': 0,
          'Human Resource Department': 0,
          'Sales & Marketing Department': 0
        }
        this.monthIncome = 0
        for(var i in this.incomeList.slice(0, -1)) {
          this.totalIncome += this.incomeList[+i].value
          if(this.incomeList[+i].date.getMonth() === this.date.getMonth() && this.incomeList[+i].date.getFullYear() === this.date.getFullYear()) {
            this.monthIncome += this.incomeList[+i].value
            this.deptIncome[this.incomeList[+i].department] += this.incomeList[+i].value
          }
          if(new Date(this.incomeList[+i].date).toDateString() !== new Date(this.incomeList[+i+1].date).toDateString()) {
            this.incomeDates += 1
          }
        }
        this.totalIncome += this.incomeList[this.incomeList.length - 1].value
        if(this.incomeList[this.incomeList.length - 1].date.getMonth() === this.date.getMonth() && this.incomeList[this.incomeList.length - 1].date.getFullYear() === this.date.getFullYear()) {
          this.monthIncome += this.incomeList[this.incomeList.length - 1].value
          this.deptIncome[this.incomeList[this.incomeList.length - 1].department] += this.incomeList[this.incomeList.length - 1].value
        }
      }
      if(this.list.length > 0)  this.barChartPopulation();
    })
  }

  ionViewWillEnter() {
    this.ls.fetchLogs().subscribe();
  }

  barChartPopulation() {
    HighCharts.chart('barChart', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'This Month Tracker'
      },
      xAxis: {
        categories: ['This Month'],
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount (dollars)',
          align: 'high'
        },
      },
      tooltip: {
        valueSuffix: ' dollars'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        type: undefined,
        name: 'Expense',
        data: [this.monthExpense]
      }, {
        type: undefined,
        name: 'Income',
        data: [this.monthIncome]
      }]
    });
  }

}
