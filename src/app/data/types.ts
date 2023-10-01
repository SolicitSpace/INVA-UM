import { Moment } from "moment";

type calendarDayT = {
    timestamp: Moment;
    dayOfMonth: string;
    date: string;
    name: string;
    isPerfCtrlOn: boolean,
    isPerformed?: boolean
}



export { calendarDayT }