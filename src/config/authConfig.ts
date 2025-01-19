export const msalConfig = {
  auth: {
    clientId: "your-client-id", // Replace with actual Azure AD client ID
    authority: "https://login.microsoftonline.com/your-tenant-id", // Replace with your tenant
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// For development/testing purposes only
export const testUsers = [
  { username: "admin", password: "testpass123" },
  { username: "admin1", password: "testpass123" },
  { username: "admin2", password: "testpass123" },
];