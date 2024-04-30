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

  get weeks(): number[] {
    return chunks(this.days, 7).map(average);
  }
}

function chunks<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

export interface Calendar {
  day(): number;
}
