import {Calendar} from "../../src/unfat.js";

export class TestCalendar implements Calendar {
  private currentDay: number = 0;

  day(): number {
    return this.currentDay;
  }

  nextDay(): void {
    this.currentDay++;
  }
}
