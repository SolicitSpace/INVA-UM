import Dexie, { Table } from 'dexie';

export interface WidgetTypeM {
  id?: number;
  value: string;
}
export interface WidgetStatusM {
  id?: number;
  status: string;
}
export interface WidgetDataM {
  id?: number;
  type: number;
  detail: string;
  target_date?: string;
  status: number;
  performed_on?: string[];
  created_on: string;
  last_edited_on: string;
}

export class AppDB extends Dexie {
  widgetData!: Table<WidgetDataM, number>;
  widgetStatus!: Table<WidgetStatusM, number>;
  widgetType!: Table<WidgetTypeM, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      widgetData: '++id',
      widgetStatus: '++id',
      widgetType: '++id',
    });
    this.on('populate', () => this.populate());
  }

  populate() {
    console.log('Creating required stores...');

    // Filling certain datas when db is first getting created
    // Populating `Widget Status` Table data
    this.generateWidgetStatusTable();

    // Populating `Widget Types` Table data
    this.generateWidgetTypeTable();
  }

  async generateWidgetStatusTable() {
    await db.widgetStatus.bulkAdd([
      {
        status: 'Ongoing',
      },
      {
        status: 'Completed',
      },
      {
        status: 'Stopped',
      },
      {
        status: 'Removed',
      },
    ]);
  }
  async generateWidgetTypeTable() {
    await db.widgetType.bulkAdd([
      {
        value: 'Countdown',
      },
      {
        value: 'Countup / Streaks',
      },
      {
        value: 'Time elapsed Tracker',
      },
    ]);
  }
}

export const db = new AppDB();
