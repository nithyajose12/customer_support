import { useState } from 'react';
import React from 'react';

function Navbar({ centerText }) {
  return (
    <header className="navbar">
      <div className="nav-left"></div>
      <div className="nav-center">{centerText}</div>
      <div className="nav-right">
        <a href="#" className="nav-link">Home</a>
      </div>
    </header>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailValidation, setEmailValidation] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@inapp\.com$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailValidation("Must end with @inapp.com");
    } else {
      setEmailValidation("");
    }
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setError("Invalid user. Please use your @inapp.com email");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem(email));
    if (!storedUser) {
      setError("User doesn't exist, please sign up!");
      return;
    }

    if (storedUser.password !== password) {
      setError("Incorrect password");
      return;
    }

    setError("");
    alert("Login successful! 🎉");
  };

  return (
    <div className="login-container">
      {/* Background Animation Elements */}
      <div className="floating-circle circle-1"></div>
      <div className="floating-circle circle-2"></div>
      <div className="floating-circle circle-3"></div>
      
      <Navbar centerText="User Login" />
      
      <div className="form-container">
        <div className="form-box floating">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Sign in to your account</p>

          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="text"
              placeholder="yourname@inapp.com"
              value={email}
              onChange={handleEmailChange}
              className={`form-input ${email && !validateEmail(email) ? 'error' : email && validateEmail(email) ? 'success' : ''}`}
            />
            {emailValidation && (
              <div className="validation-message validation-error">
                <span className="validation-icon">✗</span>
                {emailValidation}
              </div>
            )}
            {email && validateEmail(email) && (
              <div className="validation-message validation-success">
                <span className="validation-icon">✓</span>
                Valid email format
              </div>
            )}
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-link">
            <a href="#" className="link">Forgot Password?</a>
          </div>

          <button onClick={handleLogin} className="submit-btn">
            Sign In
          </button>

          <div className="form-link">
            <span>Don't have an account? </span>
            <a href="#" className="link">Sign up here</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;