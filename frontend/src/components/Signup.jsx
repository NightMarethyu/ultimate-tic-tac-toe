import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/login.css';

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
      await axios.post(`${process.env.REACT_APP_API_URL}/users/signup`, userData);
      navigate('/login');
    } catch (error) {
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