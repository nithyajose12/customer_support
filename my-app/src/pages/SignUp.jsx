import { useState } from 'react';


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

function SignUp() {
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contactValidation, setContactValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [passwordMatchValidation, setPasswordMatchValidation] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ text: "Password strength will appear here", class: "strength-weak" });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@inapp\.com$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword && password.length > 0;
  };

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return { text: "Weak: at least 6 characters", class: "strength-weak" };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
      return { text: "Medium: Add uppercase & number", class: "strength-medium" };
    return { text: "Strong password", class: "strength-strong" };
  };

  const isFormValid = () => {
    return validateEmail(form.email) &&
           validateMobile(form.contact) &&
           validatePasswordMatch(form.password, form.confirmPassword) &&
           form.password.length >= 6;
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm({ ...form, contact: value });
    
    if (value && !validateMobile(value)) {
      setContactValidation("Must be exactly 10 digits");
    } else {
      setContactValidation("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, email: value });
    
    if (value && !validateEmail(value)) {
      setEmailValidation("Must end with @inapp.com");
    } else {
      setEmailValidation("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, password: value });
    setPasswordStrength(checkPasswordStrength(value));
    
    if (form.confirmPassword) {
      if (validatePasswordMatch(value, form.confirmPassword)) {
        setPasswordMatchValidation("Passwords match");
      } else {
        setPasswordMatchValidation("Passwords do not match");
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, confirmPassword: value });
    
    if (validatePasswordMatch(form.password, value)) {
      setPasswordMatchValidation("Passwords match");
    } else {
      setPasswordMatchValidation("Passwords do not match");
    }
  };

  const handleSubmit = () => {
    // Final validation check
    if (!validateEmail(form.email)) {
      setError("Please use a valid @inapp.com email address");
      return;
    }

    if (!validateMobile(form.contact)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!validatePasswordMatch(form.password, form.confirmPassword)) {
      setError("Passwords do not match");
      return;
    }

    // Check if user already exists
    if (localStorage.getItem(form.email)) {
      setError("User already exists with this email");
      return;
    }

    // Save to localStorage
    const userData = {
      employeeId: form.employeeId,
      name: form.name,
      contact: form.contact,
      email: form.email,
      password: form.password
    };

    localStorage.setItem(form.email, JSON.stringify(userData));

    setSuccess("Sign up successful! Redirecting to login...");
    setError("");

    // Reset form
    setTimeout(() => {
      setForm({
        employeeId: "",
        name: "",
        contact: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setSuccess("");
      setContactValidation("");
      setEmailValidation("");
      setPasswordMatchValidation("");
      setPasswordStrength({ text: "Password strength will appear here", class: "strength-weak" });
      alert('Redirecting to login page...');
    }, 2000);
  };

  return (
    <div className="signup-container">
      {/* Background Animation Elements */}
      <div className="floating-circle circle-1"></div>
      <div className="floating-circle circle-2"></div>
      <div className="floating-circle circle-3"></div>
      
      <Navbar centerText="Create Account" />
      
      <div className="form-container">
        <div className="form-box floating">
          <h2 className="form-title">Sign Up</h2>
          <p className="form-subtitle">Join our support system</p>

          <div className="input-group">
            <span className="input-icon">ID</span>
            <input
              type="text"
              placeholder="Employee ID"
              className="form-input"
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Name"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">📞</span>
            <input
              type="tel"
              placeholder="Contact Number"
              className={`form-input ${form.contact && !validateMobile(form.contact) ? 'error' : form.contact && validateMobile(form.contact) ? 'success' : ''}`}
              value={form.contact}
              onChange={handleContactChange}
              maxLength={10}
            />
            <p className="input-hint">Must be exactly 10 digits</p>
            {contactValidation && (
              <div className="validation-message validation-error">
                <span className="validation-icon">✗</span>
                {contactValidation}
              </div>
            )}
            {form.contact && validateMobile(form.contact) && (
              <div className="validation-message validation-success">
                <span className="validation-icon">✓</span>
                Valid mobile number
              </div>
            )}
          </div>

          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="username@inapp.com"
              className={`form-input ${form.email && !validateEmail(form.email) ? 'error' : form.email && validateEmail(form.email) ? 'success' : ''}`}
              value={form.email}
              onChange={handleEmailChange}
            />
            <p className="input-hint">Must end with @inapp.com</p>
            {emailValidation && (
              <div className="validation-message validation-error">
                <span className="validation-icon">✗</span>
                {emailValidation}
              </div>
            )}
            {form.email && validateEmail(form.email) && (
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
              className="form-input"
              value={form.password}
              onChange={handlePasswordChange}
            />
            <p className={`password-strength ${passwordStrength.class}`}>
              {passwordStrength.text}
            </p>
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`form-input ${form.confirmPassword && !validatePasswordMatch(form.password, form.confirmPassword) ? 'error' : form.confirmPassword && validatePasswordMatch(form.password, form.confirmPassword) ? 'success' : ''}`}
              value={form.confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {passwordMatchValidation && (
              <div className={`validation-message ${validatePasswordMatch(form.password, form.confirmPassword) ? 'validation-success' : 'validation-error'}`}>
                <span className="validation-icon">
                  {validatePasswordMatch(form.password, form.confirmPassword) ? '✓' : '✗'}
                </span>
                {passwordMatchValidation}
              </div>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button 
            onClick={handleSubmit} 
            className="submit-btn"
            disabled={!isFormValid()}
          >
            Create Account
          </button>

          <div className="form-link">
            <span>Already have an account? </span>
            <a href="#" className="link">Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;