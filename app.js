const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Function to load tasks on page load
function loadTasks() {
  renderTasks(); // Simply call renderTasks to populate the list when the page loads
}

// Load tasks from localStorage when the page loads
window.onload = loadTasks;

taskForm.addEventListener('submit', function (e) {
  e.preventDefault();  // Prevent the form from reloading the page on submission

  // Capture form values
  const taskName = document.getElementById('task-name').value.trim();
  const taskPriority = document.getElementById('priority').value;
  const taskDeadline = document.getElementById('deadline').value;

  if (!taskName || !taskDeadline) {
    alert('Please fill out all fields!');
    return;
  }

  const task = {
    name: taskName,
    priority: taskPriority,
    deadline: taskDeadline,
    completed: false
  };

  // Add task to localStorage
  addTaskToLocalStorage(task);

  // Clear the form fields after submitting
  taskForm.reset();
});

function addTaskToLocalStorage(task) {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function renderTasks() {
  taskList.innerHTML = '';  // Clear existing task list
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('task-card');
    if (task.completed) {
      listItem.classList.add('completed');
    }

    listItem.innerHTML = `
      <span><strong>${task.name}</strong> (Priority: ${task.priority}, Deadline: ${task.deadline})</span>
      <div>
        <button class="btn complete-btn">Complete</button>
        <button class="btn delete-btn">❌</button>
      </div>
    `;

    taskList.appendChild(listItem);

    // Add complete button functionality
    const completeButton = listItem.querySelector('.complete-btn');
    completeButton.addEventListener('click', function () {
      task.completed = !task.completed;
      updateTaskInLocalStorage(tasks);
      renderTasks();
    });

    // Add delete button functionality
    const deleteButton = listItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function () {
      tasks.splice(index, 1);
      updateTaskInLocalStorage(tasks);
      renderTasks();
    });
  });
}

function updateTaskInLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Reminder feature: Check deadlines and show notifications
setInterval(function () {
  const tasks = getTasksFromLocalStorage();
  const currentDate = new Date().toISOString().split('T')[0];

  tasks.forEach((task, index) => {
    if (task.deadline === currentDate && !task.completed) {
      alert(`Reminder: Task "${task.name}" is due today!`);
    }
  });
}, 60000); // Check every minute
