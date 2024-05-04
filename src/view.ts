import {type Calendar, History} from "./unfat.js";

const label = document.createElement('div');
label.textContent = 'Calories:';
document.body.appendChild(label);

const preview = document.createElement('span');
preview.textContent = '0';
preview.id = 'currentCalories';
label.appendChild(preview);

const caloriesInput = document.createElement('input');
caloriesInput.id = 'calories';
caloriesInput.placeholder = 'calories';
document.body.appendChild(caloriesInput);

const nameInput = document.createElement('input');
nameInput.id = 'name';
nameInput.placeholder = 'Meal';
document.body.appendChild(nameInput);

const mealsList = document.createElement('ul');
document.body.appendChild(mealsList);

class SameDay implements Calendar {
  day(): number {
    return 1;
  }
}

const history = new History(new SameDay());

const button = document.createElement('button');
button.textContent = 'Add meal';
button.addEventListener('click', () => {
  history.addMeal(nameInput.value, parseInt(caloriesInput.value), 100);
  nameInput.value = '';
  caloriesInput.value = '';
  preview.textContent = history.currentCalories.toString();

  const listItem = document.createElement('li');
  listItem.textContent = history.meals[history.meals.length - 1].name;

  mealsList.appendChild(listItem);
});
document.body.appendChild(button);
