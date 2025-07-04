import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

// Import custom components
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (<>
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>)
}

export default App
