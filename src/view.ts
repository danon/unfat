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

class SameDay implements Calendar {
  day(): number {
    return 1;
  }
}

const history = new History(new SameDay());

const button = document.createElement('button');
button.textContent = 'Add meal';
button.addEventListener('click', () => {
  history.addMeal('', parseInt(caloriesInput.value), 100);
  preview.textContent = history.currentCalories.toString();
});
document.body.appendChild(button);
