import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Log } from './log.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';

// new Log(
//   'l1',
//   'Purchase Department',
//   'Expense',
//   'Machinery',
//   20000,
//   new Date()
// ),
// new Log(
//   'l2',
//   'Front Desk Department',
//   'Income',
//   'Room rent',
//   10000,
//   new Date()
// ),
// new Log(
//   'l3',
//   'Sales & Marketing Department',
//   'Expense',
//   'Advertisements',
//   5000,
//   new Date()
// ),


interface LogData {
  date: Date;
  department:
    | 'Front Desk Department'
    | 'Purchase Department'
    | 'Human Resource Department'
    | 'Sales & Marketing Department';
  entry: string;
  logType: 'Expense' | 'Income';
  value: number;
}

@Injectable({
  providedIn: 'root',
})

export class LogsService implements OnInit {
  private _logs = new BehaviorSubject<Log[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  get logs() {
    return this._logs.asObservable();
  }

  getLog(id: string) {
    return this.http
      .get<LogData>(
        `https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs/${id}.json`
      )
      .pipe(
        map((logData) => {
          return new Log(
            id,
            logData.department,
            logData.logType,
            logData.entry,
            logData.value,
            new Date(logData.date)
          );
        })
      );
  }

  fetchLogs() {
    return this.http
      .get(
        'https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json'
      )
      .pipe(
        map((resData) => {
          const logs = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              logs.push(
                new Log(
                  key,
                  resData[key].department,
                  resData[key].logType,
                  resData[key].entry,
                  resData[key].value,
                  new Date(resData[key].date)
                )
              );
            }
          }
          return logs;
        }),
        tap((logs) => {
          this._logs.next(logs);
        })
      );
  }

  addNewLog(
    dept:
      | 'Front Desk Department'
      | 'Purchase Department'
      | 'Human Resource Department'
      | 'Sales & Marketing Department',
    logType: 'Expense' | 'Income',
    name: string,
    amount: number,
    date: Date
  ) {
    let logId: string;
    const newLog = new Log(
      Math.random().toString(),
      dept,
      logType,
      name,
      amount,
      date
    );
    return this.http
      .post<{ name: string }>(
        'https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json',
        { ...newLog, id: null }
      )
      .pipe(
        switchMap((resData) => {
          logId = resData.name;
          return this.logs;
        }),
        take(1),
        tap((logs) => {
          newLog.id = logId;
          this._logs.next(logs.concat(newLog));
        })
      );
  }

  updateLog(
    logId: string,
    dept:
      | 'Front Desk Department'
      | 'Purchase Department'
      | 'Human Resource Department'
      | 'Sales & Marketing Department',
    logType: 'Expense' | 'Income',
    name: string,
    amount: number,
    date: Date
  ) {
    let updatedLogs: Log[];
    return this.logs.pipe(
      take(1),
      switchMap((logs) => {
        if (!logs || logs.length <= 0) return this.fetchLogs();
        else return of(logs);
      }),
      switchMap((logs) => {
        const updatedLogIndex = logs.findIndex((log) => log.id === logId);
        updatedLogs = [...logs];
        const oldLog = updatedLogs[updatedLogIndex];
        updatedLogs[updatedLogIndex] = new Log(
          oldLog.id,
          dept,
          logType,
          name,
          amount,
          date
        );
        return this.http.put(
          `https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs/${logId}.json`,
          { ...updatedLogs[updatedLogIndex], id: null }
        );
      }),
      tap(() => {
        this._logs.next(updatedLogs);
      })
    );
  }

  deleteLog(id: string) {
    return this.http
      .delete(
        `https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs/${id}.json`
      )
      .pipe(
        switchMap(() => {
          return this.logs;
        }),
        take(1),
        tap((logs) => {
          this._logs.next(logs.filter((log) => log.id !== id));
        })
      );
  }
}

// import { HttpClient } from '@angular/common/http';
// import { Injectable, OnInit } from '@angular/core';
// import { BehaviorSubject, of } from 'rxjs';
// import { map, switchMap, take, tap } from 'rxjs/operators';
// import { Log } from './log.model';

// interface LogData {
//   date: Date;
//   department:
//     | 'Front Desk department'
//     | 'Purchase department'
//     | 'Human Resource department'
//     | 'Sales & Marketing Department';
//   entry: string;
//   logType: 'Expense' | 'Income';
//   value: number;
// }

// @Injectable({
//   providedIn: 'root',
// })

// export class LogsService implements OnInit {
//   private _logs = new BehaviorSubject<Log[]>([]);

//   constructor(private http: HttpClient) {}

//   ngOnInit() {}

//   get logs() {
//     return this._logs.asObservable();
//   }

//   getLog(id: string) {
//     return this.http
//       .get<LogData>(
//         `https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs/${id}.json`
//       )
//       .pipe(
//         map((logData) => {
//           return new Log(
//             id,
//             logData.department,
//             logData.logType,
//             logData.entry,
//             logData.value,
//             new Date(logData.date)
//           );
//         })
//       );
//     // {...this._logs.find(l => l.id === id)};
//   }

//   fetchLogs() {
//     return this.http
//       .get(
//         'https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json'
//       )
//       .pipe(
//         map((resData) => {
//           const logs = [];
//           for (const key in resData) {
//             if (resData.hasOwnProperty(key)) {
//               logs.push(
//                 new Log(
//                   key,
//                   resData[key].department,
//                   resData[key].logType,
//                   resData[key].entry,
//                   resData[key].value,
//                   new Date(resData[key].date)
//                 )
//               );
//             }
//           }
//           return logs;
//         }),
//         tap((logs) => {
//           this._logs.next(logs);
//         })
//       );
//   }

//   addNewLog(
//     dept:
//       | 'Front Desk department'
//       | 'Purchase department'
//       | 'Human Resource department'
//       | 'Sales & Marketing Department',
//     logType: 'Expense' | 'Income',
//     entry: string,
//     value: number,
//     date: Date
//   ) {
//     let logId: string;
//     const newLog = new Log(
//       Math.random().toString(),
//       dept,
//       logType,
//       entry,
//       value,
//       date
//     );
//     return this.http
//       .post<{ name: string }>(
//         'https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json',
//         { ...newLog, id: null }
//       )
//       .pipe(
//         switchMap((resData) => {
//           logId = resData.name;
//           return this.logs;
//         }),
//         take(1),
//         tap((logs) => {
//           newLog.id = logId;
//           this._logs.next(logs.concat(newLog));
//         })
//       );
//   }

//   updateLog(
//     logId: string,
//     dept:
//       | 'Front Desk department'
//       | 'Purchase department'
//       | 'Human Resource department'
//       | 'Sales & Marketing Department',
//     logType: 'Expense' | 'Income',
//     entry: string,
//     value: number,
//     date: Date
//   ) {
//     let updatedLogs: Log[];
//     return this.logs.pipe(
//       take(1),
//       switchMap((logs) => {
//         if (!logs || logs.length <= 0) return this.fetchLogs();
//         else return of(logs);
//       }),
//       switchMap((logs) => {
//         const updatedLogIndex = logs.findIndex((log) => log.id === logId);
//         updatedLogs = [...logs];
//         const oldLog = updatedLogs[updatedLogIndex];
//         updatedLogs[updatedLogIndex] = new Log(
//           oldLog.id,
//           dept,
//           logType,
//           entry,
//           value,
//           date
//         );
//         return this.http.put(
//           `https://hets-eca4f-default-rtdb.asia-southeast1.firebasedatabase.app/logs/${logId}.json`,
//           { ...updatedLogs[updatedLogIndex], id: null }
//         );
//       }),
//       tap(() => {
//         this._logs.next(updatedLogs);
//       })
//     );
//   }
// }
