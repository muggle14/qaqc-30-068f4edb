export const getStoredUser = () => {
  const user = sessionStorage.getItem("user");
  console.log("Auth: Getting stored user:", user ? "Found" : "Not found");
  return user ? JSON.parse(user) : null;
};

export const validateCredentials = (username: string, password: string) => {
  console.log("Auth: Validating credentials for username:", username);
  const testUsers = [
    { username: "admin", password: "testpass123", id: "00000000-0000-0000-0000-000000000000" },
    { username: "admin1", password: "testpass123", id: "00000000-0000-0000-0000-000000000001" },
    { username: "admin2", password: "testpass123", id: "00000000-0000-0000-0000-000000000002" },
  ];
  
  return testUsers.find(
    (u) => u.username === username && u.password === password
  );
};

export const getUserRole = () => {
  return sessionStorage.getItem("userRole") || 'user';
};
