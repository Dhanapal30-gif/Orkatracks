import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown,Offcanvas } from 'react-bootstrap';
import { Avatar } from '@mui/material'; // Import Avatar from Material UI
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { FaChevronDown } from "react-icons/fa"; // Import a dropdown icon


const HeaderComponent = () => {
  const [empName, setEmpName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const sessionName = sessionStorage.getItem('empName') || 'No name available';
    const role = sessionStorage.getItem('userRole');
    const loginStatus = sessionStorage.getItem('isLoggedIn');

    // Set state with sessionStorage values
    setEmpName(sessionName);
    setUserRole(role);
    setIsLoggedIn(loginStatus === 'true'); // Set login status based on sessionStorage
  }, []);

  // Extract first and last letter from empName
  const getFirstAndLastLetters = (name) => {
    const nameParts = name.split(" ");
    const firstLetter = nameParts[0]?.charAt(0).toUpperCase();
    const lastLetter = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase();
    return firstLetter + lastLetter;
  };

  const initials = getFirstAndLastLetters(empName);

  // Handle sign out
  const handleSignOut = () => {
    sessionStorage.clear(); // Clear sessionStorage on signout
    setIsLoggedIn(false); // Update state after signout
    navigate('/login'); // Redirect to login page
  };
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const toggleServicesDropdown = () => {
    setServicesDropdown(!servicesDropdown);
  };

  const closeServicesDropdown = () => {
    setServicesDropdown(false);
  };
  return (
    <header className="header">
      <div className="logo-section">
        <img
          src="/path/to/logo.png" // Replace with your logo path
          alt="Logo"
          className="logo"
        />
        <span className="logo-text">ORKA</span>
      </div>

      <nav className="nav">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li
            className="dropdown-container"
            onMouseEnter={toggleServicesDropdown}
            onMouseLeave={closeServicesDropdown}
          >
            <span className="nav-link" >DashBoard <FaChevronDown className="dropdown-icon" /></span>
            {servicesDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/FinanceDashboard" className="dropdown-item">
                  Finance
                  </Link>
                </li>
                <li>
                  <Link to="/ProjectDashBoard" className="dropdown-item">
                  Project
                  </Link>
                </li>
                <li>
                  <Link to="/service3" className="dropdown-item">
                    Sales
                  </Link>
                </li>
              </ul>
            )}
          </li>    
          <li
            className="dropdown-container"
            onMouseEnter={toggleServicesDropdown}
            onMouseLeave={closeServicesDropdown}
          >
            <span className="nav-link" >Create Record <FaChevronDown className="dropdown-icon" /></span>
            {servicesDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/AccountsSheet" className="dropdown-item">
                  Accounts
                  </Link>
                </li>
                <li>
                  <Link to="/Project" className="dropdown-item">
                  Project
                  </Link>
                </li>
                <li>
                  <Link to="/Accounts" className="dropdown-item">
                  Accounts
                  </Link>
                </li>
              </ul>
            )}
          </li>        
          <li><Link to="/solutions">Solutions</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </nav>

      <div className="auth-buttons">
        <Link to="/signin" className="signin-btn">Sign In</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </header>
  
  );
};

export default HeaderComponent;
