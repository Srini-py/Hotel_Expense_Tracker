import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as HighCharts from 'highcharts';
import { GoogleChartInterface } from 'ng2-google-charts';
import { Log } from 'src/app/logs/log.model';
import { LogsService } from 'src/app/logs/logs.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})

export class ChartsPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: true
  }

  deptDict: { [key: string]: number } = {
    'Front Desk Department': 0,
    'Human Resource Department': 0,
    'Purchase Department': 0,
    'Sales & Marketing Department': 0,
  };
  arrInc: number[] = [0, 0, 0, 0];

  arrMonthExp: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  arrMonthInc: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  deptYearExp: { [key: string]: number[] } = {
    'Front Desk Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Human Resource Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Purchase Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Sales & Marketing Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  deptYearInc: { [key: string]: number[] } = {
    'Front Desk Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Human Resource Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Sales & Marketing Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }


  logs: Log[];
  year1: string = new Date().getFullYear().toString();
  year2: string = new Date().getFullYear().toString();
  year3: string = new Date().getFullYear().toString();

  public lineChart: GoogleChartInterface;

  constructor(private ls: LogsService, private datepipe: DatePipe) {}

  ngOnInit() {
    this.ls.logs.subscribe((logs) => {
      this.logs = logs;
      for (var i in this.logs) {
        if (this.logs[+i].logType === 'Expense') {
          this.deptDict[this.logs[+i].department] += this.logs[+i].value;
        }
        if (this.logs[+i].logType === 'Income') {
          if (this.logs[+i].department === 'Front Desk Department')
            this.arrInc[0] += this.logs[+i].value;
          else if (this.logs[+i].department === 'Human Resource Department')
            this.arrInc[1] += this.logs[+i].value;
          else if (this.logs[+i].department === 'Purchase Department')
            this.arrInc[2] += this.logs[+i].value;
          else if (this.logs[+i].department === 'Sales & Marketing Department')
            this.arrInc[3] += this.logs[+i].value;
        }
      }
      if (this.logs.length > 0) {
        this.pieChartBrowser();
        this.loadPieChart();
        this.onChange2(this.year1);
        this.onChangeExpense2(this.year2);
        this.onChangeIncome2(this.year3);
        this.loadLineChart();
        this.loadLineChart2();
        this.loadLineChart3();
      }
    });
  }

  ionViewWillEnter() {
    this.ls.fetchLogs().subscribe();
  }

  onChange(event) {
    this.onChange2(event.detail.value);
  }

  onChange2(val) {
    this.ls.logs.subscribe((logs) => {
      this.logs = logs;
      this.arrMonthExp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.arrMonthInc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.year1 = this.datepipe.transform(val, 'yyyy');
      for (var i in this.logs) {
        if (
          this.logs[+i].logType === 'Expense' &&
          this.logs[+i].date.getFullYear().toString() === this.year1
        ) {
          this.arrMonthExp[this.logs[+i].date.getMonth()] +=
            this.logs[+i].value;
        }
        if (
          this.logs[+i].logType === 'Income' &&
          this.logs[+i].date.getFullYear().toString() === this.year1
        ) {
          this.arrMonthInc[this.logs[+i].date.getMonth()] +=
            this.logs[+i].value;
        }
      }
      this.loadLineChart();
    });
  }

  onChangeExpense(event) {
    this.onChangeExpense2(event.detail.value);
  }

  onChangeExpense2(val) {
    this.ls.logs.subscribe((logs) => {
      this.logs = logs;
      this.deptYearExp = {
        'Front Desk Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Human Resource Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Purchase Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Sales & Marketing Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      this.year2 = this.datepipe.transform(val, 'yyyy');
      for (var i in this.logs) {
        if (
          this.logs[+i].logType === 'Expense' &&
          this.logs[+i].date.getFullYear().toString() === this.year2
        ) {
          this.deptYearExp[this.logs[+i].department][this.logs[+i].date.getMonth()] += this.logs[+i].value
        }
      }
      this.loadLineChart2();
    });
  }

  onChangeIncome(event) {
    this.onChangeIncome2(event.detail.value)
  }

  onChangeIncome2(val) {
    this.ls.logs.subscribe((logs) => {
      this.logs = logs;
      this.deptYearInc = {
        'Front Desk Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Human Resource Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Sales & Marketing Department': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      this.year3 = this.datepipe.transform(val, 'yyyy');
      for (var i in this.logs) {
        if (
          this.logs[+i].logType === 'Income' &&
          this.logs[+i].date.getFullYear().toString() === this.year3
        ) {
          this.deptYearInc[this.logs[+i].department][this.logs[+i].date.getMonth()] += this.logs[+i].value
        }
      }
      this.loadLineChart3();
    });
  }

  pieChartBrowser() {
    HighCharts.chart('pieChart1', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: 'Expense Chart',
      },
      tooltip: {
        pointFormat: '',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Expenses',
          colorByPoint: true,
          type: undefined,
          data: [
            {
              name: 'Front Desk Department',
              y: this.deptDict['Front Desk Department'],
              sliced: true,
              selected: true,
            },
            {
              name: 'Human Resource Department',
              y: this.deptDict['Human Resource Department'],
            },
            {
              name: 'Purchase Department',
              y: this.deptDict['Purchase Department'],
            },
            {
              name: 'Sales & Marketing Department',
              y: this.deptDict['Sales & Marketing Department'],
            },
          ],
        },
      ],
    });
  }

  loadPieChart() {
    HighCharts.chart('pieChart2', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: 'Income Chart',
      },
      tooltip: {
        pointFormat: '',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Incomes',
          colorByPoint: true,
          type: undefined,
          data: [
            {
              name: 'Front Desk Department',
              y: this.arrInc[0],
              sliced: true,
              selected: true,
            },
            {
              name: 'Human Resource Department',
              y: this.arrInc[1],
            },
            {
              name: 'Purchase Department',
              y: this.arrInc[2],
            },
            {
              name: 'Sales & Marketing Department',
              y: this.arrInc[3],
            },
          ],
        },
      ],
    });
  }

  loadLineChart() {
    HighCharts.chart('LineChart1', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'line',
      },
      title: {
        text: 'Yearly Tracker',
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Money',
          align: 'low',
        },
      },
      tooltip: {
        valueSuffix: ' dollars',
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      series: [
        {
          type: undefined,
          name: 'Expenses',
          data: this.arrMonthExp,
        },
        {
          type: undefined,
          name: 'Income',
          data: this.arrMonthInc,
        },
      ],
    });
  }

  loadLineChart2() {
    HighCharts.chart('LineChart2', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'line',
      },
      title: {
        text: 'Yearly Expense Tracker(Department Wise)',
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Money',
          align: 'low',
        },
      },
      tooltip: {
        valueSuffix: ' dollars',
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      series: [
        {
          type: undefined,
          name: 'Front Desk Department',
          data: this.deptYearExp['Front Desk Department']
        },
        {
          type: undefined,
          name: 'Human Resource Department',
          data: this.deptYearExp['Human Resource Department']
        },
        {
          type: undefined,
          name: 'Purchase Department',
          data: this.deptYearExp['Purchase Department']
        },
        {
          type: undefined,
          name: 'Sales & Marketing Department',
          data: this.deptYearExp['Sales & Marketing Department']
        }
      ],
    });
  }

  loadLineChart3() {
    HighCharts.chart('LineChart3', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'line',
      },
      title: {
        text: 'Yearly Income Tracker(Department Wise)',
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Money',
          align: 'low',
        },
      },
      tooltip: {
        valueSuffix: ' dollars',
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      series: [
        {
          type: undefined,
          name: 'Front Desk Department',
          data: this.deptYearInc['Front Desk Department']
        },
        {
          type: undefined,
          name: 'Human Resource Department',
          data: this.deptYearInc['Human Resource Department']
        },
        {
          type: undefined,
          name: 'Sales & Marketing Department',
          data: this.deptYearInc['Sales & Marketing Department']
        }
      ],
    });
  }
}
