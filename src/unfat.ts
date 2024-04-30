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

  get week(): number {
    return average(this.days);
  }
}

function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export interface Calendar {
  day(): number;
}
