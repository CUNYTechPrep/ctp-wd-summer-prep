const form = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-name');
const habitList = document.getElementById('habit-list');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = habitInput.value.trim();
  if (name === '') return;

  const li = document.createElement('li');
  li.textContent = name;
  habitList.appendChild(li);

  habitInput.value = '';
});
