import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Log } from 'src/app/logs/log.model';
import { LogsService } from 'src/app/logs/logs.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {
  @ViewChild('f', {static: true}) form: NgForm

  maxExp: number = 0
  minExp = Number.MAX_SAFE_INTEGER
  maxInc: number = 0
  minInc = Number.MAX_SAFE_INTEGER

  maxDayExp = 0
  minDayExp = Number.MAX_SAFE_INTEGER
  maxDayInc = 0
  minDayInc = Number.MAX_SAFE_INTEGER

  maxMonthExp = 0
  minMonthExp = Number.MAX_SAFE_INTEGER
  maxMonthInc = 0
  minMonthInc = Number.MAX_SAFE_INTEGER

  maxYearExp = 0
  minYearExp = Number.MAX_SAFE_INTEGER
  maxYearInc = 0
  minYearInc = Number.MAX_SAFE_INTEGER

  departmentExpense: number[] = [0, 0, 0, 0]
  maxExpensiveDept: any
  minExpensiveDept: any
  departmentIncome: number[] = [0, 0, 0, 0]
  maxEarnedDept: any
  minEarnedDept: any

  expenseDate: number = 0
  incomeDate: number = 0

  expenseMonth: number = 0
  incomeMonth: number = 0

  expenseYear: number = 0
  incomeYear: number = 0

  totExp: number = 0
  totInc: number = 0

  dt: string
  dt2: string

  mt: string
  mt2: string

  yr: string
  yr2: string

  logList: Log[]

  constructor(private ls: LogsService, private datepipe: DatePipe) { }

  ngOnInit() {

    this.ls.logs.subscribe(logs => {
      this.logList = logs;

      //Get Minimum and Maximum expenses and incomes and also corresponding department
      this.totExp = 0
      this.totInc = 0
      this.departmentExpense = [0, 0, 0, 0]
      this.departmentIncome = [0, 0, 0, 0]
      for(var i in this.logList) {
        var ent = this.logList[+i].logType;
        var dept = this.logList[+i].department;
        if(ent == 'Expense') {
          var expense = this.logList[+i].value
          this.totExp += expense
          if(expense > this.maxExp) this.maxExp = expense
          if(expense < this.minExp)  this.minExp = expense
          if(dept === 'Front Desk Department')  this.departmentExpense[0] += this.logList[+i].value;
          if(dept === 'Human Resource Department') this.departmentExpense[1] += this.logList[+i].value;
          if(dept === 'Purchase Department') this.departmentExpense[2] += this.logList[+i].value;
          if(dept === 'Sales & Marketing Department') this.departmentExpense[3] += this.logList[+i].value;
        }
        else {
          var income = this.logList[+i].value
          this.totInc += income;
          if(income > this.maxInc)  this.maxInc = income
          if(income < this.minInc) this.minInc = income
          if(dept === 'Front Desk Department')  this.departmentIncome[0] += this.logList[+i].value;
          if(dept === 'Human Resource Department') this.departmentIncome[1] += this.logList[+i].value;
          if(dept === 'Purchase Department') this.departmentIncome[2] += this.logList[+i].value;
          if(dept === 'Sales & Marketing Department') this.departmentIncome[3] += this.logList[+i].value;
        }
      }
      this.maxExpensiveDept = Math.max(...this.departmentExpense)
      this.maxExpensiveDept = this.departmentExpense.indexOf(this.maxExpensiveDept)
      this.maxExpensiveDept = this.getDepartment(this.maxExpensiveDept)
      this.minExpensiveDept = Math.min(...this.departmentExpense)
      this.minExpensiveDept = this.departmentExpense.indexOf(this.minExpensiveDept)
      this.minExpensiveDept = this.getDepartment(this.minExpensiveDept)
      this.maxEarnedDept = Math.max(...this.departmentIncome)
      this.maxEarnedDept = this.departmentIncome.indexOf(this.maxEarnedDept)
      this.maxEarnedDept = this.getDepartment(this.maxEarnedDept)
      this.minEarnedDept = Math.min(...this.departmentIncome)
      this.minEarnedDept = this.departmentIncome.indexOf(this.minEarnedDept)
      this.minEarnedDept = this.getDepartment(this.minEarnedDept)


      this.logList.sort((obj1, obj2) => {
        var c = new Date(obj1.date)
        var d = new Date(obj2.date)
        return (c > d)? 1: -1;
      })

      //Get Expense and Income on particular day
      this.dt = this.datepipe.transform(new Date(), 'MMM-dd-YYYY')
      this.dt2 = this.datepipe.transform(new Date(), 'MMM-dd-YYYY')
      this.onChangeDateExpense(this.dt)
      this.onChangeDateIncome(this.dt2)

      this.mt = this.datepipe.transform(new Date(), 'MMM-YYYY')
      this.mt2 = this.datepipe.transform(new Date(), 'MMM-YYYY')
      this.onChangeMonthExpense(this.mt)
      this.onChangeMonthIncome(this.mt2)

      this.yr = this.datepipe.transform(new Date(), 'YYYY')
      this.yr2 = this.datepipe.transform(new Date(), 'YYYY')
      this.onChangeYearExpense(this.yr)
      this.onChangeYearIncome(this.yr2)


      //Get Minimum and Maximum Expenses and Incomes for a day
      this.getExpenseForDayMonthYear([...this.logList], 1);

      //Get Minimum and Maximum Expenses and Incomes for a month
      this.getExpenseForDayMonthYear([...this.logList], 2);

      //Get Minimum and Maximum Expenses ad Incomes for a year
      this.getExpenseForDayMonthYear([...this.logList], 3);

    });
  }

  ionViewWillEnter() {
    this.ls.fetchLogs().subscribe();
  }

  onChangeDate1(event) {
    this.onChangeDateExpense(event.detail.value);
  }

  onChangeDateExpense(val: string) {
    this.ls.logs.subscribe(logs => {
      this.logList = logs
      this.expenseDate = 0
      for(var i in this.logList) {
        if(this.datepipe.transform(val, 'MM-dd-YYYY') === this.datepipe.transform(this.logList[+i].date, 'MM-dd-YYYY')) {
          if(this.logList[+i].logType === 'Expense') this.expenseDate += this.logList[+i].value
        }
      }
    })
  }

  onChangeDate2(event) {
    this.onChangeDateIncome(event.detail.value)
  }

  onChangeDateIncome(val: string) {
    this.ls.logs.subscribe(logs => {
      this.logList = logs
      this.incomeDate = 0
      for(var i in this.logList) {
        if(this.datepipe.transform(val, 'MM-dd-YYYY') === this.datepipe.transform(this.logList[+i].date, 'MM-dd-YYYY')) {
          if(this.logList[+i].logType === 'Income') this.incomeDate += this.logList[+i].value
        }
      }
    })
  }

  onChangeMonth1(event) {
    this.onChangeMonthExpense(event.detail.value);
  }

  onChangeMonthExpense(val: string) {
    this.ls.logs.subscribe(logs => {
      this.logList = logs
      this.expenseMonth = 0
      for(var i in this.logList) {
        if(this.datepipe.transform(val, 'MM-YYYY') === this.datepipe.transform(this.logList[+i].date, 'MM-YYYY')) {
          if(this.logList[+i].logType === 'Expense') this.expenseMonth += this.logList[+i].value
        }
      }
    })
  }

  onChangeMonth2(event) {
    this.onChangeMonthIncome(event.detail.value)
  }

  onChangeMonthIncome(val: string) {
    this.ls.logs.subscribe(logs => {
      this.logList = logs
      this.incomeMonth = 0
      for(var i in this.logList) {
        if(this.datepipe.transform(val, 'MM-YYYY') === this.datepipe.transform(this.logList[+i].date, 'MM-YYYY')) {
          if(this.logList[+i].logType === 'Income') this.incomeMonth += this.logList[+i].value
        }
      }
    })
  }

  onChangeYear1(event) {
    this.onChangeYearExpense(event.detail.value)
  }

  onChangeYearExpense(val: string) {
    this.ls.logs.subscribe(logs => {
      this.logList = logs
      this.expenseYear = 0
      for(var i in this.logList) {
        if(this.datepipe.transform(val, 'yyyy') === this.datepipe.transform(this.logList[+i].date, 'yyyy')) {
          if(this.logList[+i].logType === 'Expense') this.expenseYear += this.logList[+i].value
        }
      }
    })
  }

  onChangeYear2(event) {
    this.onChangeYearIncome(event.detail.value)
  }

  onChangeYearIncome(val: string) {
    this.ls.logs.subscribe(logs => {
      this.logList = logs
      this.incomeYear = 0
      for(var i in this.logList) {
        if(this.datepipe.transform(val, 'yyyy') === this.datepipe.transform(this.logList[+i].date, 'yyyy')) {
          if(this.logList[+i].logType === 'Income') this.incomeYear += this.logList[+i].value
        }
      }
    })
  }

  getDepartment(num) {
    if(num === 0) return "Front Desk Department"
    if(num === 1) return "Human Resource Department"
    if(num === 2) return "Purchase Department"
    if(num === 3) return "Sales & Marketing Department"
  }

  getExpenseForDayMonthYear(list: Log[], num: Number) {
    var exp: number = 0
    var inc: number = 0
    var expList = list.filter(record => record.logType === 'Expense')
    var incList = list.filter(record => record.logType === 'Income')
    if(num === 1) {
      if(expList.length > 0){
        exp += expList[0].value
        for(var i in expList.slice(0, -1)) {
          if(new Date(expList[+i].date).toDateString() === new Date(expList[+i+1].date).toDateString()) exp += expList[+i+1].value
          else {
            if(exp > this.maxDayExp)  this.maxDayExp = exp
            if(exp < this.minDayExp && exp > 0) this.minDayExp = exp
            exp = expList[+i+1].value
          }
        }
        if(exp > this.maxDayExp)  this.maxDayExp = exp
        if(exp < this.minDayExp && exp > 0) this.minDayExp = exp
      }
      if(incList.length > 0){
        inc += incList[0].value
        for(var i in incList.slice(0, -1)) {
          if(new Date(incList[+i].date).toDateString() === new Date(incList[+i+1].date).toDateString()) inc += incList[+i+1].value
          else {
            if(inc > this.maxDayInc)  this.maxDayInc = inc
            if(inc < this.minDayInc && inc > 0) this.minDayInc = inc
            inc = incList[+i+1].value
          }
        }
        if(inc > this.maxDayInc)  this.maxDayInc = inc
        if(inc < this.minDayInc && inc > 0) this.minDayInc = inc
      }
    }
    else if(num === 2) {
      if(expList.length > 0){
        exp += expList[0].value
        for(var i in expList.slice(0, -1)) {
          if(expList[+i].date.getMonth() === expList[+i+1].date.getMonth() && expList[+i].date.getFullYear() === expList[+i+1].date.getFullYear()) exp += expList[+i+1].value
          else {
            if(exp > this.maxMonthExp)  this.maxMonthExp = exp
            if(exp < this.minMonthExp && exp > 0) this.minMonthExp = exp
            exp = expList[+i+1].value
          }
        }
        if(exp > this.maxMonthExp)  this.maxMonthExp = exp
        if(exp < this.minMonthExp && exp > 0) this.minMonthExp = exp
      }
      if(incList.length > 0){
        inc += incList[0].value
        for(var i in incList.slice(0, -1)) {
          if(incList[+i].date.getMonth() === incList[+i+1].date.getMonth() && incList[+i].date.getFullYear() === incList[+i+1].date.getFullYear()) inc += incList[+i+1].value
          else {
            if(inc > this.maxMonthInc)  this.maxMonthInc = inc
            if(inc < this.minMonthInc && inc > 0) this.minMonthInc = inc
            inc = incList[+i+1].value
          }
        }
        if(inc > this.maxMonthInc)  this.maxMonthInc = inc
        if(inc < this.minMonthInc && inc > 0) this.minMonthInc = inc
      }
    }
    else if(num === 3) {
      if(expList.length > 0){
        exp += expList[0].value
        for(var i in expList.slice(0, -1)) {
          if(expList[+i].date.getFullYear() === expList[+i+1].date.getFullYear()) exp += expList[+i+1].value
          else {
            if(exp > this.maxYearExp)  this.maxYearExp = exp
            if(exp < this.minYearExp && exp > 0) this.minYearExp = exp
            exp = expList[+i+1].value
          }
        }
        if(exp > this.maxYearExp)  this.maxYearExp = exp
        if(exp < this.minYearExp && exp > 0) this.minYearExp = exp
      }
      if(incList.length > 0){
        inc += incList[0].value
        for(var i in incList.slice(0, -1)) {
          if(incList[+i].date.getFullYear() === incList[+i+1].date.getFullYear()) inc += incList[+i+1].value
          else {
            if(inc > this.maxYearInc)  this.maxYearInc = inc
            if(inc < this.minYearInc && inc > 0) this.minYearInc = inc
            inc = incList[+i+1].value
          }
        }
        if(inc > this.maxYearInc)  this.maxYearInc = inc
        if(inc < this.minYearInc && inc > 0) this.minYearInc = inc
      }
    }
  }

}
