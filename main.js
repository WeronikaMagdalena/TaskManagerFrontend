const apiBaseUrl = 'http://localhost:8080/api/tasks';
const cognitoClientId = '6ql677v8v9pj4jciqlr7elc68c';
const redirectUri = 'http://localhost:3000//login/oauth2/code/cognito'; // This must match what you set in AWS Cognito
const cognitoLoginUrl = `https://task-manager-app.auth.us-east-1.amazoncognito.com/login?client_id=${cognitoClientId}&response_type=code&scope=openid&redirect_uri=${redirectUri}`;

// Check if the user is logged in
function isLoggedIn() {
  const token = localStorage.getItem('access_token');
  return !!token; // Returns true if token exists, false otherwise
}

// Redirect to Cognito login
function redirectToLogin() {
  window.location.href = cognitoLoginUrl;
}

// Handle OAuth2 callback to get the authorization code
function handleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');

  if (authCode) {
    exchangeCodeForTokens(authCode);
  }
}

// Exchange the authorization code for access tokens
function exchangeCodeForTokens(authCode) {
  fetch('http://localhost:8080/auth/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: authCode })
  })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('access_token', data.access_token);
      window.location.href = '/'; // Redirect to home page after successful login
    })
    .catch(err => console.error('Error exchanging code for tokens:', err));
}

// Fetch tasks if logged in
function fetchTasks() {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  fetch(apiBaseUrl, {
    headers: { Authorization: `Bearer ${token}` }
  })
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
    })
    .catch(err => console.error('Error fetching tasks:', err));
}

// Create a new task
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
  const token = localStorage.getItem('access_token');

  if (!token) {
    alert('You must be logged in to create tasks.');
    return;
  }

  fetch(apiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(task)
  })
    .then(() => {
      document.getElementById('title').value = '';
      document.getElementById('description').value = '';
      document.getElementById('deadline').value = '';
      fetchTasks();
    })
    .catch(err => console.error('Error creating task:', err));
}

// Initialize the application
function init() {
  if (window.location.search.includes('code')) {
    handleAuthCallback(); // Handle OAuth2 callback
  } else if (!isLoggedIn()) {
    // Hide app content and show login button until authenticated
    document.getElementById('app-content').style.display = 'none';
    document.getElementById('login-button').style.display = 'block';
  } else {
    // If the user is logged in, hide the login button and show the app content
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    fetchTasks(); // Fetch tasks if authenticated
  }
}

init();
