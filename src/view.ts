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

const button = document.createElement('button');
button.textContent = 'Add meal';
button.addEventListener('click', () => {
  preview.textContent = caloriesInput.value;
});
document.body.appendChild(button);
