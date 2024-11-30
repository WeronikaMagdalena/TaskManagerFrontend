import { UserManager } from '/node_modules/oidc-client-ts';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_CVJi78BGl",
  client_id: "53cs6tmp5mbp6k1tltcu6f22fq",
  redirect_uri: "http://localhost:3000/callback",
  response_type: "code",
  scope: "email openid profile"
};

// create a UserManager instance
export const userManager = new UserManager({
  ...cognitoAuthConfig,
});

export async function signOutRedirect() {
  const clientId = "53cs6tmp5mbp6k1tltcu6f22fq";
  const logoutUri = "http://localhost:3000/logout";
  const cognitoDomain = "https://task-manager-app.auth.us-east-1.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};