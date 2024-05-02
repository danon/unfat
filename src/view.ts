const label = document.createElement('div');
label.textContent = 'Calories:';
document.body.appendChild(label);

const preview = document.createElement('span');
preview.textContent = '0';
preview.id = 'currentCalories';
label.appendChild(preview);
