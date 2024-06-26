import {createApp, h, reactive} from "vue";

import {type Calendar, History, type Meal, type Store} from "./unfat.js";

const app = createApp(() => {
  return [
    h('div', {}, [
      'Calories: ',
      h('span', {id: 'currentCalories'}, [view.currentCalories.toString()]),
    ]),
    h('input', {
      placeholder: 'Meal',
      id: 'name',
      value: view.mealName,
      onChange: event => view.mealName = (event.target as HTMLInputElement).value,
    }),
    h('input', {
      placeholder: 'Calories',
      id: 'calories',
      value: view.mealCalories,
      onChange: event => view.mealCalories = (event.target as HTMLInputElement).value,
    }),
    h('ul', view.meals.map((meal: Meal) =>
      h('li', [
        h('p', [meal.name]),
        h('span', [meal.calories]),
      ]))),
    h('button', {onClick: addMeal}, ['Add meal']),
  ];
});

const view = reactive({
  currentCalories: 0,
  mealName: '',
  mealCalories: '',
  meals: <Meal[]>[],
});

app.mount('body');

class SameDay implements Calendar {
  day(): number {
    return 1;
  }
}

class LocalStorage implements Store {
  addMeal(meal: Meal): void {
    window.localStorage.setItem('meals',
      JSON.stringify([...this.meals(), meal]));
  }

  meals(): Meal[] {
    const meals = window.localStorage.getItem('meals');
    if (meals === null) {
      return [];
    }
    return JSON.parse(meals);
  }
}

const history = new History(new SameDay(), new LocalStorage());

function addMeal(): void {
  history.addMeal(view.mealName, parseInt(view.mealCalories), 100);
  view.mealName = '';
  view.mealCalories = '';
  view.currentCalories = history.currentCalories;
  view.meals.push(history.meals[history.meals.length - 1]);
}

view.meals = [...history.meals];
