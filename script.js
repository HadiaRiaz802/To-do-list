let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const priorityInput = document.getElementById('priority');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort-select');

// ADD TASK
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const text = taskInput.value.trim();

  // INPUT VALIDATION
  if(text.length < 3) {
    alert('Task must contain at least 3 characters');
    return;
  }

  const task = {
    id: Date.now(),
    text,
    priority: priorityInput.value,
    done: false,
    date: new Date().toLocaleString()
  };

  tasks.unshift(task);

  save();
  render();

  form.reset();
});

// SAVE TO LOCAL STORAGE
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// DELETE TASK
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  save();
  render();
}

// TOGGLE COMPLETE
function toggleTask(id) {

  tasks = tasks.map(task => {

    if(task.id === id) {
      task.done = !task.done;
    }

    return task;
  });

  save();
  render();
}

// FILTER BUTTONS
function setFilter(filter, btn) {

  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach(button => {
    button.classList.remove('active');
  });

  btn.classList.add('active');

  render();
}

// SEARCH FILTER
searchInput.addEventListener('input', render);

// SORTING
sortSelect.addEventListener('change', render);

// RENDER TASKS
function render() {

  let filtered = [...tasks];

  // FILTERING
  if(currentFilter === 'active') {
    filtered = filtered.filter(task => !task.done);
  }

  if(currentFilter === 'done') {
    filtered = filtered.filter(task => task.done);
  }

  // SEARCHING
  const keyword = searchInput.value.toLowerCase();

  filtered = filtered.filter(task =>
    task.text.toLowerCase().includes(keyword)
  );

  // SORTING
  if(sortSelect.value === 'oldest') {
    filtered.reverse();
  }

  if(sortSelect.value === 'priority') {

    const order = {
      High: 1,
      Medium: 2,
      Low: 3
    };

    filtered.sort((a, b) =>
      order[a.priority] - order[b.priority]
    );
  }

  // STATS
  const total = tasks.length;
  const done = tasks.filter(task => task.done).length;
  const left = total - done;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-left').textContent = left;

  // PROGRESS BAR
  const percent = total
    ? Math.round((done / total) * 100)
    : 0;

  document.getElementById('prog-pct').textContent =
    percent + '%';

  document.getElementById('progress-fill').style.width =
    percent + '%';

  // EMPTY STATE
  const empty = document.getElementById('empty-state');

  if(filtered.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
  }

  // DISPLAY TASKS
  taskList.innerHTML = filtered.map(task => `

    <tr class="${task.done ? 'done' : ''}">

      <td>${task.text}</td>

      <td class="priority-${task.priority.toLowerCase()}">
        ${task.priority}
      </td>

      <td>${task.date}</td>

      <td>
        <button onclick="toggleTask(${task.id})">
          ${task.done ? 'Completed' : 'Pending'}
        </button>
      </td>

      <td>
        <button onclick="deleteTask(${task.id})">
          Delete
        </button>
      </td>

    </tr>

  `).join('');
}

// DARK/LIGHT MODE
const themeBtn = document.getElementById('theme-btn');

themeBtn.addEventListener('click', () => {

  document.body.classList.toggle('light');

  if(document.body.classList.contains('light')) {
    themeBtn.textContent = '☀️';
  } else {
    themeBtn.textContent = '🌙';
  }
});

// WEB API INTEGRATION
async function loadQuote() {

  try {

    const response =
      await fetch('https://api.quotable.io/random');

    const data = await response.json();

    document.getElementById('quote').textContent =
      data.content + ' — ' + data.author;

  } catch(error) {

    document.getElementById('quote').textContent =
      'Stay productive and keep working hard!';
  }
}

// INITIAL LOAD
loadQuote();
render();