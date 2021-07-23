export class Log {
  constructor(
    public id: string,
    public department: 'Front Desk Department' | 'Purchase Department' | 'Human Resource Department' | 'Sales & Marketing Department',
    public logType: 'Expense' | 'Income',
    public entry: string,
    public value: number,
    public date: Date
  ) { }
}
