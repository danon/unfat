export class History {
  currentCalories: number = 0;

  addMeal(name: string, weight: number, caloriesPer100Grams: number): void {
    this.currentCalories += Math.round(weight / 100 * caloriesPer100Grams);
  }
}
