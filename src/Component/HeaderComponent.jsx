import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { Avatar } from '@mui/material'; // Import Avatar from Material UI
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'

const HeaderComponent = () => {
  const [empName, setEmpName] = useState('');
  const [userRole, setUserRole] = useState(''); // Track user role
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate(); // Use navigate hook for redirecting

  useEffect(() => {
    const sessionName = sessionStorage.getItem('empName') || 'No name available';
    const role = sessionStorage.getItem('userRole');
    const loginStatus = sessionStorage.getItem('isLoggedIn'); // Assuming you store login status in sessionStorage

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

  return (
    <div>
      <Navbar className='app-bar' variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>ORKA</Navbar.Brand>
          <Navbar.Collapse id="navbar-nav">
            <Nav className="dropdown_bar">
              {/* Common links for both Admin and Employee */}
              {isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/Home" style={{ fontFamily: '"Roboto", sans-serif', color: '#e7c568' }}>Home</Nav.Link>
                  <Nav.Link as={Link} to="/Projects" style={{ color: 'white' }}>Projects</Nav.Link>
                  <Nav.Link as={Link} to="/Performance" style={{ color: 'white' }}>Performance</Nav.Link>

                  {/* Admin-specific links */}
                  {userRole === 'Admin' && (
                    <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Admin</span>} id="admin-dropdown">
                      <NavDropdown.Item as={Link} to="/AllTask">Task</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/AllPerformance">Performance</NavDropdown.Item>
                    </NavDropdown>
                  )}

                  <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Leave</span>}>
                    <NavDropdown.Item as={Link} to="/Leave">Apply Leave</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/Approve">Approve</NavDropdown.Item>
                  </NavDropdown>


                  {/* Task and Master links for both Admin and Employee */}
                  <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Task</span>}>
                    <NavDropdown.Item as={Link} to="/writeTask">Write Task</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/Task">Task Status</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Master</span>} >
                    <NavDropdown.Item as={Link} to="/ProjectManagement">Project Management</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/LeaveManagement">Leave Management</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/TaskManagement">Task Management</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  {/* Links for non-logged-in users */}
                   <Nav.Link as={Link} to="/Home" style={{ fontFamily: '"Roboto", sans-serif', color: '#e7c568' }}>Home</Nav.Link>
                  {/* <Nav.Link as={Link} to="/Projects" style={{ color: 'white' }}>Projects</Nav.Link>
                  <Nav.Link as={Link} to="/Performance" style={{ color: 'white' }}>Performance</Nav.Link> */}

                  {/* Admin-specific links */}
                  {userRole === 'Admin' && (
                    <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Admin</span>} id="admin-dropdown">
                      <NavDropdown.Item as={Link} to="/AllTask">Task</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/AllPerformance">Performance</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/Accounts">Accounts</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/Dashboard">Dashboard</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/Project">Project</NavDropdown.Item>

                    </NavDropdown>
                  )}

                  {/* <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Leave</span>}>
                    <NavDropdown.Item as={Link} to="/Leave">Apply Leave</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/Approve">Approve</NavDropdown.Item>
                  </NavDropdown> */}

                  {/* Task and Master links for both Admin and Employee */}
                  {/* <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Task</span>}>
                    <NavDropdown.Item as={Link} to="/writeTask">Write Task</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/Task">Task Status</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Master</span>} >
                    <NavDropdown.Item as={Link} to="/ProjectManagement">Project Management</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/LeaveManagement">Leave Management</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/TaskManagement">Task Management</NavDropdown.Item>

                  </NavDropdown> */}
                  {/* <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Admin</span>} id="admin-dropdown">
                      <NavDropdown.Item as={Link} to="/AllTask">Task</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/AllPerformance">Performance</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/Accounts">Accounts</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/Dashboard">Dashboard</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/Project">Project</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/ProjectsDahboard">ProjectsDahboard</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/FinanceVault">FinanceVault</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/FinanceDashboard">FinanceDashboard</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/ProjectDashBoard">ProjectDashBoard</NavDropdown.Item>

                    </NavDropdown> */}
                     {/* <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Admin</span>} id="admin-dropdown">
                      <NavDropdown.Item as={Link} to="/Accounts">Accounts</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/Project">Project</NavDropdown.Item>
                    </NavDropdown> */}

                    <NavDropdown title={<span style={{ fontFamily: '"Roboto", sans-serif', color: 'white' }}>Dashboard</span>} id="admin-dropdown">
                      <NavDropdown.Item as={Link} to="/FinanceDashboard">Finance</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/ProjectDashBoard">Project</NavDropdown.Item>
                    </NavDropdown>
                  {/* <Nav.Link as={Link} to="/Company">Company</Nav.Link>
                  <Nav.Link as={Link} to="/Workout">Workout</Nav.Link>

                  <Nav.Link as={Link} to="/Home">Service</Nav.Link> */}
                  <Nav.Link as={Link} to="/Login" style={{ marginLeft: '750px' }}>Signin</Nav.Link>
                  <Nav.Link as={Link} to="/Home" style={{ fontFamily: '"Roboto", sans-serif', color: 'black', padding: '10px', backgroundColor: '#e7c568', borderRadius: '10%', border: 'none', display: 'inline-block' }}>Contact Us</Nav.Link>
                </>
              )}
            </Nav>

            {/* User Info with Rounded Avatar and Name */}
            {isLoggedIn && (
              <div className="d-flex align-items-center text-white ms-auto">
                <div className="d-flex align-items-center">
                  {/* Avatar with first and last letters */}
                  <Avatar style={{ marginRight: '10px', backgroundColor: '#1976d2' }}>
                    {initials}
                  </Avatar>
                </div>
                <Link to="/" className="btn btn-outline-light ms-4" onClick={handleSignOut}>Signout</Link>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default HeaderComponent;
