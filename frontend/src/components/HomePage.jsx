import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      {user ? (
        // 1. Add a wrapping fragment and remove the stray ">"
        <>
          <h1 className="display-1">{user.username}</h1>
          <div className="row">
            <div className="col-sm">
              <button onClick={logout} className="btn btn-primary btn-block">Logout</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="display-1">Hello There</h1>
          <button onClick={handleLoginRedirect} className="btn btn-primary">Login</button>
        </>
      )}
      <div className="col-sm">
        <button className="btn btn-primary btn-block">New Game (Coming Soon)</button>
      </div>
      <div className="col-sm">
        <button className="btn btn-primary btn-block">Join Game (Coming Soon)</button>
      </div>
    </>
  );
};

export default HomePage;