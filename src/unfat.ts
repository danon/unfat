export class History {
  public readonly meals: Meal[] = new Array();
  private readonly calories: Map<number, number> = new Map();

  constructor(private calendar: Calendar) {
  }

  addMeal(name: string, caloriesPer100Grams: number, weight: number): void {
    const calories = this.mealCalories(weight, caloriesPer100Grams);
    this.increaseCalories(calories);
    this.meals.push({name, calories});
  }

  private mealCalories(weight: number, caloriesPer100Grams: number): number {
    return Math.round(weight / 100 * caloriesPer100Grams);
  }

  private increaseCalories(newCalories: number): void {
    this.calories.set(this.calendar.day(), this.currentCalories + newCalories);
  }

  get currentCalories(): number {
    return this.calories.get(this.calendar.day()) || 0;
  }

  get days(): number[] {
    return Array.from(this.calories.values());
  }

  get weeks(): number[] {
    return chunks(this.days, 7).map(average);
  }
}

interface Meal {
  name: string;
  calories: number;
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
