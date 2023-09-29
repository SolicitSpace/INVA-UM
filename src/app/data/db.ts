import Dexie, { Table } from 'dexie';
import * as moment from 'moment';
// export interface WidgetTypeM {
//   id?: number;
//   value: string;
// }
export interface WidgetPriorityM {
  id?: number;
  value: string;
}
export interface WidgetStatusM {
  id?: number;
  value: string;
}
// export interface WidgetDataM {
//   id?: number;
//   type: number;
//   detail: string;
//   target_date?: string;
//   status: number;
//   performed_on?: string[];
//   created_on: string;
//   last_edited_on: string;
// }
export interface WidgetDataM {
  id?: number;
  detail: string;
  target_date?: string;
  status: number;
  performed_on?: string[];
  priority_id: number;
  is_highlighted: boolean;
  color: string;
  created_on: string;
  last_edited_on: string;
}

export class AppDB extends Dexie {
  widgetData!: Table<WidgetDataM, number>;
  widgetStatus!: Table<WidgetStatusM, number>;
  // widgetType!: Table<WidgetTypeM, number>;
  widgetPriority!: Table<WidgetPriorityM, number>;

  constructor() {
    super('ngdexieliveQuery');

    this.version(3).stores({
      widgetData: '++id',
      widgetStatus: '++id',
      widgetPriority: '++id',
    });
    this.on('populate', () => this.populate());
  }

  populate() {
    // Filling certain datas when db is first getting created
    // Populating `Widget Status` Table data
    this.generateWidgetStatusTable();

    // Populating `Widget Types` Table data
    // this.generateWidgetTypeTable();

    // Populating `Widget Priority` Table data
    this.generateWidgetPriorityTable();

    this.generateWidgetTableDebug();

    // this.stressTestWidgetTable();

    console.log('Creating required stores...');
  }

  async generateWidgetStatusTable() {
    await db.widgetStatus.bulkAdd([
      {
        value: 'Ongoing',
      },
      {
        value: 'Completed',
      },
      {
        value: 'Stopped',
      },
      {
        value: 'Removed',
      },
    ]);
  }
  async generateWidgetPriorityTable() {
    await db.widgetPriority.bulkAdd([
      {
        value: 'Low',
      },
      {
        value: 'Medium',
      },
      {
        value: 'High',
      },
    ]);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  async generateWidgetTableDebug() {
    // let performedOn = [];

    let createdOnDate, targetDate;
    const lim = 5
    for (let i = 1; i < lim; i++) {
      // performedOn.push(1693022081 + i);

      createdOnDate = moment()
        .subtract(this.getRandomInt(0, 20), 'days')
        .format();
      targetDate =
        i < Math.round(lim / 2)
          ? moment().add(this.getRandomInt(0, 20), 'days').format()
          : '';

      await db.widgetData.add({
        detail: 'Debug Task no. ' + i,
        status: 1,
        performed_on: [],
        priority_id: 1,
        is_highlighted: true,
        color: 'yellow',
        created_on: createdOnDate,
        target_date: targetDate,
        last_edited_on: createdOnDate,
      });
    }
  }

  async stressTestWidgetTable() {
    // let performedOn = [];

    // for (let i = 0; i < 365 * 10; i++) performedOn.push(1693022081 + i);

    // console.log('performedOn : ', performedOn);

    let widgets = [];
    for (let i = 0; i < 1000; i++) {
      widgets.push({
        detail: 'synapse ' + i,
        target_date: '',
        status: 1,
        performed_on: [],
        priority_id: 1,
        is_highlighted: true,
        color: 'yellow',
        created_on: 'string',
        last_edited_on: 'string',
      });
    }
    console.log('widgets : ', widgets);
    await db.widgetData.bulkAdd(widgets);
  }
}
export const db = new AppDB();
