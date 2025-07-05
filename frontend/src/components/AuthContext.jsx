import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider component that manages authentication state and provides
 * authentication-related functions to its children via React Context.
 *
 * - On mount, checks localStorage for existing user credentials and sets user state if found.
 * - Provides `login` and `logout` functions to update authentication state and localStorage.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the AuthContext.
 * @returns {JSX.Element} AuthContext.Provider wrapping the children with authentication state and actions.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
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
