import Dexie, { Table } from 'dexie';

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
  // async generateWidgetTypeTable() {
  //   await db.widgetType.bulkAdd([
  //     {
  //       value: 'Countdown',
  //     },
  //     {
  //       value: 'Countup / Streaks',
  //     },
  //     {
  //       value: 'Time elapsed Tracker',
  //     },
  //   ]);
  // }
}

export const db = new AppDB();
