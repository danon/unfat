export class History {
  private calories: { [key: number]: number } = {};

  constructor(private calendar: Calendar) {
  }

  addMeal(name: string, caloriesPer100Grams: number, weight: number): void {
    this.increaseCalories(Math.round(weight / 100 * caloriesPer100Grams));
  }

  private increaseCalories(newCalories: number): void {
    this.calories[this.calendar.day()] = this.currentCalories + newCalories;
  }

  get currentCalories(): number {
    return this.calories[this.calendar.day()] || 0;
  }

  get days(): number[] {
    return Object.values(this.calories);
  }
}

export interface Calendar {
  day(): number;
}
