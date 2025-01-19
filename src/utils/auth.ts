export const getStoredUser = () => {
  const user = sessionStorage.getItem("user");
  console.log("Auth: Getting stored user:", user ? "Found" : "Not found");
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (username: string) => {
  console.log("Auth: Storing user:", username);
  sessionStorage.setItem("user", JSON.stringify({ username }));
};

export const validateCredentials = (username: string, password: string) => {
  const testUsers = [
    { username: "admin", password: "testpass123" },
    { username: "admin1", password: "testpass123" },
    { username: "admin2", password: "testpass123" },
  ];
  
  return testUsers.find(
    (u) => u.username === username && u.password === password
  );
};