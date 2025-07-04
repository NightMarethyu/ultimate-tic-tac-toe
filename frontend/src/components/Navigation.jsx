import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top bg-body-tertiary">
      <Link className="navbar-brand" to="/">Ultimate Tic Tac Toe</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link">Hello, {user.username}</span>
              </li>
              <li className="nav-item">
                <button onClick={logout} className="btn btn-link nav-link">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav >
  );
}

export default Navigation;