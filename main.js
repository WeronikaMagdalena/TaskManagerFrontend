const apiBaseUrl = 'http://localhost:8080/api/tasks';

function createTask() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const deadline = document.getElementById('deadline').value;
  const titleError = document.getElementById('title-error');

  titleError.textContent = '';

  if (!title) {
    titleError.textContent = 'Title is required.';
    return;
  }

  const task = { title, description, completed: false, deadline };

  fetch(apiBaseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then(() => {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('deadline').value = '';
    fetchTasks();
  });
}

function fetchTasks() {
  fetch(apiBaseUrl)
    .then(response => response.json())
    .then(tasks => {
      const tasksDiv = document.getElementById('tasks');
      tasksDiv.innerHTML = '';

      tasks.forEach(task => {
        const taskHtml = `
          <div class="task-item">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
            <div class="task-content">
              <span class="task-title">${task.title}</span>
              <p class="task-description">${task.description}</p>
              ${task.deadline ? `<p class="task-deadline">Deadline: ${task.deadline}</p>` : ''}
            </div>
          </div>
        `;
        tasksDiv.innerHTML += taskHtml;
      });
    });
}

function toggleTask(taskId) {
  fetch(`${apiBaseUrl}/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: isCompleted })
  }).then(fetchTasks);
}

fetchTasks();