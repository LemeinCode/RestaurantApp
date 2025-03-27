export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.role : null;
  };
  
  export const isAuthorized = () => {
    const role = getUserRole();
    return role === "admin" || role === "manager";
  };
  