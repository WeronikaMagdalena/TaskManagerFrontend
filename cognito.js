// const apiBaseUrl = 'http://localhost:8080/api/tasks';
// const cognitoClientId = '6ql677v8v9pj4jciqlr7elc68c';
// const redirectUri = 'http://localhost:3000'; // This must match what you set in AWS Cognito

// // Check if the user is logged in
// function checkAuth() {
//   const token = localStorage.getItem('access_token');
//   if (!token) {
//     // Redirect to Cognito login if no token is found
//     window.location.href = `https://task-manager-app.auth.us-east-1.amazoncognito.com/login?client_id=${cognitoClientId}&response_type=code&scope=openid&redirect_uri=${redirectUri}`;
//   }
// }

// // Handle OAuth2 callback to get the authorization code
// function handleAuthCallback() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const authCode = urlParams.get('code');

//   if (authCode) {
//     exchangeCodeForTokens(authCode);
//   }
// }

// // Exchange the authorization code for access tokens
// function exchangeCodeForTokens(authCode) {
//   // TODO: Do I have this endpoint?
//   fetch('http://localhost:8080/auth/exchange', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ code: authCode })
//   })
//     .then(response => response.json())
//     .then(data => {
//       localStorage.setItem('access_token', data.access_token);
//       window.location.href = '/index'; // Redirect back to the app after successful login
//     })
//     .catch(err => console.error('Error exchanging code for tokens:', err));
// }