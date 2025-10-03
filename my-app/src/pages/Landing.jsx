import React, { useEffect, useState } from 'react';
import feather from 'feather-icons'; 

const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
    feather.replace(); 
    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Close mobile menu when clicking outside
    const handleClickOutside = (e) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      
      if (mobileMenu && 
          !mobileMenu.contains(e.target) && 
          !mobileMenuButton.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Update Feather icons when mobile menu state changes
    if (window.feather) {
      window.feather.replace();
    }
  }, [isMobileMenuOpen]);

  // Add this useEffect hook after the existing ones
  useEffect(() => {
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
      fadeInObserver.observe(el);
    });

    return () => {
      fadeElements.forEach(el => {
        fadeInObserver.unobserve(el);
      });
    };
  }, []);

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const features = [
    {
      id: 1,
      icon: 'clock',
      title: '24/7 Availability',
      description: 'Our team is always ready to assist you, day or night, weekends included.',
      bgColor: '#710117'
    },
    {
      id: 2,
      icon: 'users',
      title: 'Expert Team',
      description: 'Certified professionals with years of experience in customer support.',
      bgColor: '#54627B'
    },
    {
      id: 3,
      icon: 'zap',
      title: 'Fast Resolution',
      description: 'Average response time under 5 minutes for critical issues.',
      bgColor: '#710117'
    }
  ];

  const stats = [
    { value: '99%', label: 'Customer Satisfaction' },
    { value: '24/7', label: 'Support Availability' },
    { value: '5min', label: 'Avg. Response Time' },
    { value: '10k+', label: 'Issues Resolved' }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo-container">
              <span className="logo">SupportPro</span>
            </div>
            
            {/* Navigation */}
            <nav className="desktop-nav">
              <a href="index.html" className="nav-link">Home</a>
              <a href="about.html" className="nav-link">About</a>
              <a href="signup.html" className="nav-link">Signup</a>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              id="mobile-menu-button"
              className="mobile-menu-button" 
              onClick={toggleMobileMenu}
            >
              <i data-feather={isMobileMenuOpen ? "x" : "menu"}></i>
            </button>
          </div>
          
          {/* Mobile Menu */}
          <div 
            id="mobile-menu" 
            className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
          >
            <a href="index.html" className="mobile-nav-link">Home</a>
            <a href="about.html" className="mobile-nav-link">About</a>
            <a href="signup.html" className="mobile-nav-link">Signup</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text fade-in">
              <h1 className="hero-title">
                Premium <span className="text-gradient">Customer Support</span>
              </h1>
              <p className="hero-description">
                Experience unparalleled service with our dedicated support team, available 24/7 to resolve your issues promptly and efficiently.
              </p>
              <div className="hero-buttons">
                <a href="login.html?type=user" className="btn btn-primary pulse">
                  Login as User
                </a>
                <a href="login.html?type=agent" className="btn btn-secondary">
                  Login as Agent
                </a>
              </div>
            </div>
            <div className="hero-image-container fade-in">
              <div className="floating">
                <img 
                  src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Customer Support" 
                  className="hero-image"
                />
                <div className="image-decoration glow">
                  <i data-feather="headphones"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">Why Choose Our Support?</h2>
            <div className="section-divider"></div>
            <p className="section-description">
              We provide exceptional customer service with cutting-edge technology and a dedicated team of professionals.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.id} className="feature-card fade-in">
                <div 
                  className="feature-icon pulse" 
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <i data-feather={feature.icon}></i>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item fade-in">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content fade-in">
            <h2 className="cta-title">Ready to Experience Premium Support?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers who trust us with their support needs.
            </p>
            <a href="signup.html" className="btn btn-primary">
              Get Started Today
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-logo">SupportPro</span>
              <p className="footer-tagline">Premium customer support solutions</p>
            </div>
            
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Contact Us</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2023 SupportPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;