import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser({ username: storedUser });
    }
  }, []);

  const login = (username, token) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
