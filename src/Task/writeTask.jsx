import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField, Button,MenuItem } from '@mui/material';
import './Task.css';
import { getTask, sendTask } from '../Services/Services';
import { url } from '../appConfig';

const WriteTask = () => {
  // Get session storage
  const setempId = sessionStorage.getItem('empId');
  const setempName = sessionStorage.getItem('empName');
  const [updateData, setUpdateData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [getDataTable, setGetDataTable] = useState({ isTrue: true });
  const [employee, setEmployee] = useState([]);
  const [getProjectNo, setGetProjectNo] = useState([]);
  const [getProjectName, setGetProjectName] = useState([]);
  const [getMacroTask, setGetMacroTask] = useState([]);
  const [getMicroTask, setGetMicroTask] = useState([]);
  const [getStatus, setGetStatus] = useState([]);

  const [formData, setFormData] = useState({
    empId: setempId || '',
    projectNo:  '',
    projectName: '',
    macroTask: '',
    microTask: '',
    incharge: setempName,
    startDate: '',
    endDate: '',
    status: 'NotStarted',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Set the number of tasks to display per page

  // Calculate the indices of the first and last tasks to display
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = employee.slice(indexOfFirstTask, indexOfLastTask);

  // Calculate total pages
  const totalPages = Math.ceil(employee.length / tasksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onAddButtonClick = () => {
    if (!formData.projectNo) {
      alert('Project No is required');
      return;
    }
    if (!formData.projectName) {
      alert('Project Name is required');
      return;
    }
    if (!formData.macroTask) {
      alert('Macro Task is required');
      return;
    }
    if (!formData.microTask) {
      alert('Micro Task is required');
      return;
    }
    if (!formData.incharge) {
      alert('Incharge is required');
      return;
    }
    if (!formData.startDate) {
      alert('Start Date is required');
      return;
    }
    if (!formData.endDate) {
      alert('End Date is required');
      return;
    }

    setUpdateData([...updateData, formData]);
    console.log(updateData);

    // After adding the data, clear form
    setFormData({
      projectNo: '',
      projectName: '',
      macroTask: '',
      microTask: '',
      incharge: '',
      startDate: '',
      endDate: '',
      status: '',
    });
    setShowTable(true);
    setGetDataTable((prevState) => ({ ...prevState, isFalse: false }));
  };

  const handleDelete = (index) => {
    const updatedProjects = updateData.filter((_, i) => i !== index);
    setUpdateData(updatedProjects);
  };

  const handleEdit = (index) => {
    const projectToEdit = updateData[index];
    console.log('Editing project:', projectToEdit);
    // Implement edit logic here
  };

  const getData = () => {
    if (getDataTable.isTrue) {
      getTask()
        .then((response) => {
          console.log('empId', setempId);
          setEmployee(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    getData();
    getTaske();
  }, []); // Ensure this runs only once
  
  const getTaske = async () => {
    try {
        const response = await fetch(`${url}/api/getTaskManagemet`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const getTaskManagement = await response.json();
        console.log("getTaskManagement", getTaskManagement);

        // Check if the response is an object (not an array)
        if (getTaskManagement && typeof getTaskManagement === 'object') {
            const projectno = [];
            const projectname = [];
            const macroTask = [];
            const microTask = [];
            const status = [];
            // Loop through each projectNo entry in the object
            for (const [projectNo, taskData] of Object.entries(getTaskManagement)) {
                // Add projectNo to projectno array
                projectno.push({ value: projectNo, label: projectNo });

                // Map and add each project name, macro task, and micro task to respective arrays
                taskData.projectName.forEach(name => {
                    projectname.push({ value: name, label: name });
                });
                taskData.macroTask.forEach(task => {
                    macroTask.push({ value: task, label: task });
                });
                taskData.microTask.forEach(task => {
                    microTask.push({ value: task, label: task });
                });
                taskData.status.forEach(task => {
                  status.push({ value: task, label: task });
              });
            }

            // Update state with the collected values
            setGetProjectNo(projectno);
            setGetProjectName(projectname);
            setGetMacroTask(macroTask);
            setGetMicroTask(microTask);
            setGetStatus(status);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

  

  const handleSubmit = (e) => {
    e.preventDefault();
    sendTask(updateData).then((response) => {
      console.log('formData', formData);
      console.log('updateData', updateData);
      setUpdateData([]);
      setShowTable(false);
      // Re-fetch data
      getData();
      setGetDataTable((prevState) => ({ ...prevState, isTrue: true }));
    });
  };
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
      <h4>
  Task
</h4>
      <form style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }} onSubmit={handleSubmit}>
        <TextField
  label="Project No"
  name="projectNo"
  variant="outlined" // Changed to 'outlined'
  fullWidth
  select // Specify that this is a select input
  sx={{ flexBasis: '13%', marginLeft: '20px' }} // Using sx for styling
  value={formData.projectNo || ''} // Ensure it's controlled
  onChange={handleChange}
  required
>
  {getProjectNo.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
</TextField>
<TextField
  select
  label="Project Name"
  name="projectName"
  variant="outlined"
  fullWidth
  sx={{ flexBasis: '23%' }}
  value={formData.projectName}
  onChange={handleChange}
>
  {getProjectName.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
</TextField>

<TextField
  select
  label="Macro Task"
  name="macroTask"
  variant="outlined"
  fullWidth
  sx={{ flexBasis: '23%' }}
  value={formData.macroTask}
  onChange={handleChange}
>
  {getMacroTask.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
</TextField>
<TextField
  select
  label="Micro Task"
  name="microTask"
  variant="outlined"
  fullWidth
  sx={{ flexBasis: '23%' }}
  value={formData.microTask}
  onChange={handleChange}
>
  {getMicroTask.map(option => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ))}
</TextField>
        <TextField
          label="Incharge"
          name="incharge"
          variant="outlined"
          fullWidth
          sx={{ flexBasis: '13%', marginLeft: '20px' }}
          value={formData.incharge}
          onChange={handleChange}
          InputProps={{
            readOnly: true, // Makes the field read-only
          }}
        />
        <TextField
          label="Start Date"
          name="startDate"
          variant="outlined"
          fullWidth
          sx={{ flexBasis: '23%' }}
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.startDate}
          onChange={handleChange}
        />
        <TextField
          label="End Date"
          name="endDate"
          variant="outlined"
          fullWidth
          sx={{ flexBasis: '23%' }}
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.endDate}
          onChange={handleChange}
        /> 
        <TextField 
          label="Status"
          name="status"
          variant="outlined"
          fullWidth
          sx={{ flexBasis: '23%' }}
          value={formData.status}
          onChange={handleChange}
          disabled
        >{getStatus.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        </TextField>
        <Button variant="contained" style={{ marginTop: '16px' }} onClick={onAddButtonClick}>
          ADD
        </Button>
      </form>

      {showTable && (
        <div>
          <h4>Add Task Details</h4>
          <table>
            <thead>
              <tr>
                <th>ProjectNo</th>
                <th>ProjectName</th>
                <th>MacroTask</th>
                <th>MicroTask</th>
                <th>Incharge</th>
                <th>StartDate</th>
                <th>EndDate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {updateData.map((taskData, index) => (
                <tr key={index}>
                  <td>{taskData.projectNo}</td>
                  <td>{taskData.projectName}</td>
                  <td>{taskData.macroTask}</td>
                  <td>{taskData.microTask}</td>
                  <td>{taskData.incharge}</td>
                  <td>{taskData.startDate}</td>
                  <td>{taskData.endDate}</td>
                  <td>{taskData.status}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="contained" color="primary" fullWidth type="submit" onClick={handleSubmit}style={{width:'20px'}}>
            Submit
          </Button>
        </div>
      )}

      {getDataTable && (
        <div>
          <h6 style={{ marginLeft: '-1390px', marginTop: '10px' }}>All Task Details</h6>
          <table>
            <thead>
              <tr>
                <th>ProjectNo</th>
                <th>ProjectName</th>
                <th>MacroTask</th>
                <th>MicroTask</th>
                <th>Incharge</th>
                <th>StartDate</th>
                <th>EndDate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((taskData, index) => (
                <tr key={index}>
                  <td>{taskData.projectNo}</td>
                  <td>{taskData.projectName}</td>
                  <td>{taskData.macroTask}</td>
                  <td>{taskData.microTask}</td>
                  <td>{taskData.incharge}</td>
                  <td>{taskData.startDate}</td>
                  <td>{taskData.endDate}</td>
                  <td className={getStatusClass(taskData.status)}>{taskData.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className="page-item">
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WriteTask;