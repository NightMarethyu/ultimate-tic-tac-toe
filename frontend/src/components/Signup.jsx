import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/login.css';

/**
 * Signup React component for user registration.
 *
 * Renders a signup form that collects username, password, email, first name, and last name.
 * On successful signup, redirects the user to the login page.
 * Displays an error message if signup fails.
 *
 * @component
 * @returns {JSX.Element} The rendered signup form component.
 *
 * @example
 * <Signup />
 */
const Signup = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/users/signup`, userData); // Should be using `import.meta.env.VITE_API_URL/users/signup` but it's not working that way
      // Redirect to login page after successful signup
      navigate('/login');
    } catch (error) {
      console.error(error);
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="ring">
          <i></i>
          <i></i>
          <i></i>
          <div className="login">
            <h2>Sign Up</h2>
            {error && <p>{error}</p>}
            <div className="inputBx">
              <input type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Username" /></div>
            <div className="inputBx">
              <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
            </div>
            <div className="inputBx">
              <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" />
            </div>
            <div className="inputBx">
              <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} placeholder="First Name" />
            </div>
            <div className="inputBx">
              <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>
            <div className="inputBx">
              <button type="submit">Sign Up</button>
            </div>
          </div>
        </div>
      </form>
      <p className="bottom">Styling found on <a href="https://codepen.io/Gogh/pen/gOqVqBx" target="_blank" rel="noreferrer">Codepen.io</a>.</p>
    </>
  );
};

export default Signup;