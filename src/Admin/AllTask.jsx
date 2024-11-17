import React, { useState, useEffect } from 'react';
import { getAllEmployeDeatil, getTaskDeatil } from '../Services/Services';
import './Admin.css';
import { TextField, Button, MenuItem } from '@mui/material';

const AllTask = () => {
  const [getData, setGetData] = useState([]);
  const [getTask, setGetTask] = useState([]);
  const [formErrors, setFormErrors] = useState({ empId: '', empName: '' });
  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Number of tasks per page
  const [filteredData, setFilteredData] = useState([]); // Store filtered tasks

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredData.slice(indexOfFirstTask, indexOfLastTask);

  // Fetch Employee Details
  useEffect(() => {
    getEmployeDeatil();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (searchTerm) {
      const filtered = getTask.filter((task) => {
        return task.projectNo.toLowerCase().includes(searchTerm.toLowerCase()) || task.status.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to page 1 when search term changes
    } else {
      setFilteredData(getTask);
    }
  }, [searchTerm, getTask]); // Only run when searchTerm or getTask changes

  const validate = () => {
    let isValid = true;
    const errors = {};
    if (!formData.empName) {
      errors.empName = "Please select employee name";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const getEmployeDeatil = () => {
    getAllEmployeDeatil()
      .then((response) => {
        setGetData(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.log('Error fetching employee details:', error);
      });
  };

  const fetchTaskDetails = (formData) => {
    // Ensure that we don't make an API call unless the empId has changed
    if (!formData.empId || !formData.empName) return;

    getTaskDeatil(formData)
      .then((response) => {
        setGetTask(response.data);
        setFilteredData(response.data); // Update filteredData with fetched tasks
      })
      .catch((error) => {
        console.log('Error fetching task details:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // If empName is selected, find the corresponding empId
    if (name === 'empName') {
      const selectedEmployee = getData.find(
        (employee) => `${employee.firstName} ${employee.lastName}` === value
      );
      if (selectedEmployee) {
        setFormData({
          empId: selectedEmployee.empId, // Set empId from the selected employee
          empName: value, // Display full name (firstName + lastName)
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      fetchTaskDetails(formData); // Trigger task fetching
    }
  };

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  };

  // Get the CSS class based on task status
  const getStatusClass = (status) => {
    switch (status) {
      case 'closed':
        return 'status-closed';
      case 'Ongoing':
        return 'status-ongoing';
      case 'pending':
        return 'status-pending';
      case 'NotStarted':
      default:
        return 'status-notstarted';
    }
  };

  return (
    <div>
      <div className="allTask">
        <h4 style={{ marginTop: '-70px', marginLeft: '-10px', width: '190px' }}>Fetch Task</h4>
        <form onSubmit={handleSubmit}>
          {/* Dropdown for Employee Name */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <TextField
              label="Employee Name"
              name="empName"
              variant="standard"
              fullWidth
              select
              value={formData.empName || ''}
              onChange={handleChange}
              error={Boolean(formErrors.empName)}
              helperText={formErrors.empName}
              style={{ width: '250px' }}
              SelectProps={{
                native: false,
              }}
            >
              {getData.map((item) => (
                <MenuItem key={item.empId} value={`${item.firstName} ${item.lastName}`}>
                  {`${item.firstName} ${item.lastName}`}
                </MenuItem>
              ))}
            </TextField>

            {/* Display Corresponding Employee ID */}
            <TextField
              label="Employee ID"
              name="empId"
              variant="standard"
              fullWidth
              value={formData.empId || ''}
              InputProps={{
                readOnly: true, // Make the empId field read-only
              }}
              style={{ width: '250px' }}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            style={{
              marginTop: '10px',
              width: '160px',
              marginLeft: '422px',
              backgroundColor: 'blue',
              color: 'white',
            }}
          >
            View
          </Button>
        </form>
      </div>

      {/* Search Bar */}
      <div style={{ margin: '20px',
                  width: '300px',
                  borderRadius: '5px',
                  marginLeft: '1090px',
                  border: '1px solid #ccc', }}>
        <TextField
          label="Search by Project No or Status"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Project No</th>
            <th>Project Name</th>
            <th>Macro Task</th>
            <th>Micro Task</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task, index) => (
            <tr key={index}>
              <td>{task.projectNo}</td>
              <td>{task.projectName}</td>
              <td>{task.macroTask}</td>
              <td>{task.microTask}</td>
              <td>{formatDate(task.startDate)}</td>
              <td>{formatDate(task.endDate)}</td>
              <td className={getStatusClass(task.status)}>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Pagination buttons */}
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredData.length / tasksPerPage) }, (_, index) => (
            <li key={index + 1} className="page-item">
              <button
                className={`page-link ${index + 1 === currentPage ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>

        {/* Display total number of tasks */}
        <div style={{ fontWeight: 'bold' }}>
          Total Tasks: {filteredData.length}
        </div>
      </div>
    </div>
  );
};

export default AllTask;
