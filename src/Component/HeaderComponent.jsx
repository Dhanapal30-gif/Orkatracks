import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { Avatar } from '@mui/material'; // Import Avatar from Material UI
import 'bootstrap/dist/css/bootstrap.min.css';

const HeaderComponent = () => {
  const [empName, setEmpName] = useState('');
  const [userRole, setUserRole] = useState(''); // Track user role
  const navigate = useNavigate(); // Use navigate hook for redirecting

  useEffect(() => {
    const sessionName = sessionStorage.getItem('empName') || 'No name available';
    const role = sessionStorage.getItem('userRole'); // Get the user role from sessionStorage
    setEmpName(sessionName);
    setUserRole(role); // Set the user role
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
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>ORKA Track</Navbar.Brand>
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {/* Common links for both Admin and Employee */}
              <Nav.Link as={Link} to="/Home">Home</Nav.Link>
              <Nav.Link as={Link} to="/Projects">Projects</Nav.Link>
              <Nav.Link as={Link} to="/Performance">Performance</Nav.Link>

              {/* Admin-specific links */}
              {userRole === 'Admin' && (
                <NavDropdown title="Admin" id="admin-dropdown">
                  <NavDropdown.Item as={Link} to="/AllTask">Task</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/AllPerformance">Performance</NavDropdown.Item>
                </NavDropdown>
              )}

                <NavDropdown title="Leave" id="leave-dropdown">
                  <NavDropdown.Item as={Link} to="/Leave">Apply Leave</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Approve">Approve</NavDropdown.Item>
                </NavDropdown>

              {/* Task and Master links for both Admin and Employee */}
              <NavDropdown title="Task" id="task-dropdown">
                <NavDropdown.Item as={Link} to="/writeTask">Write Task</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/Task">Task Status</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Master" id="master-dropdown">
                <NavDropdown.Item as={Link} to="/ProjectManagement">Project Management</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/LeaveManagement">Leave Management</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/TaskManagement">TaskManagement</NavDropdown.Item>
              </NavDropdown>
            </Nav>

            {/* User Info with Rounded Avatar and Name */}
            <div className="d-flex align-items-center text-white ms-auto">
              <div className="d-flex align-items-center">
                {/* Avatar with first and last letters */}
                <Avatar style={{ marginRight: '10px', backgroundColor: '#1976d2' }}>
                  {initials}
                </Avatar>
              </div>
              <Link to="/" className="btn btn-outline-light ms-4">Signout</Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default HeaderComponent;
