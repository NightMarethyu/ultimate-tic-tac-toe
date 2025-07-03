import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../stylesheets/login.css";

const Login = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { username, password }
      );
      login(response.data.username, response.data.token);
      navigate("/");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="ring">
          <i></i>
          <i></i>
          <i></i>
          <div className="login">
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <div className="inputBx">
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="inputBx">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="inputBx">
              <input type="submit"
                value="Login" onSubmit={handleSubmit} />
            </div>
            <div className="inputBx">
              <button onClick={() => navigate("/signup")}>Sign up</button>
            </div>
          </div>
        </div>
      </form>
      <p className="bottom">Styling found on <a href="https://codepen.io/Gogh/pen/gOqVqBx">CodePen</a>.</p>
    </>
  );
};

export default Login;