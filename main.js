const apiBaseUrl = 'http://localhost:8080/api/tasks';

// Helper function to create tasks
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
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Include token for authentication
    },
    body: JSON.stringify(task),
  }).then(() => {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('deadline').value = '';
    fetchTasks();
  });
}

// Function to fetch and display tasks
function fetchTasks() {
  fetch(apiBaseUrl, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Include token for authentication
    },
  })
    .then(response => response.json())
    .then(tasks => {
      const tasksDiv = document.getElementById('tasks');
      tasksDiv.innerHTML = '';

      tasks.forEach(task => {
        const taskHtml = `
          <div class="task-item">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id}, ${!task.completed})">
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

// Function to toggle task completion status
function toggleTask(taskId, isCompleted) {
  fetch(`${apiBaseUrl}/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Include token for authentication
    },
    body: JSON.stringify({ completed: isCompleted }),
  }).then(fetchTasks);
}

// URL for Cognito login page
const cognitoUrl = `https://task-manager-app.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=16o4fuqp5o5gdrrmds9255flp1&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}`;

// Trigger login when button is clicked
document.getElementById("loginButton")?.addEventListener("click", function () {
  window.location.href = cognitoUrl;
});

window.onload = function () {
  if (!localStorage.getItem('access_token')) {
    // Show login button if no token found
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
      loginButton.style.display = "block";
    }
    const taskManagerContainer = document.getElementById("taskManagerContainer");
    if (taskManagerContainer) {
      taskManagerContainer.style.display = "none";
    }
  } else {
    // Hide login button and show task manager if token exists
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
      loginButton.style.display = "none";
    }
    const taskManagerContainer = document.getElementById("taskManagerContainer");
    if (taskManagerContainer) {
      taskManagerContainer.style.display = "block";
    }
    fetchTasks(); // Load tasks if logged in
  }
};
