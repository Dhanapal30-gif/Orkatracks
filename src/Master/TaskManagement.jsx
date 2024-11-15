import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { projectmanagement, taskManagement } from '../Services/Services';
import { Description as ExcelIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import UpdateIcon from "@mui/icons-material/Edit";

import './TaskManagement.css';

const TaskManagement = () => {
  const [formErrors, setFormErrors] = useState({
    projectNo: '',
    projectName: '',
    macroTask: '',
    microTask: '',
    
  });

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const [updateFormData, setUpdateFormData] = useState(null);
  const [alert, setAlert] = useState(null);
  const [getProjectNo, setGetProjectNo] = useState([]);
  const [getProjectName, setGetProjectName] = useState([]);
  const [uploadedTasks, setUploadedTasks] = useState([]); // Store uploaded tasks
  const [showUploadTable, setShowUploadTable] = useState(false); // State to toggle upload table
  const [allTasks, setAllTasks] = useState([]); // Store all tasks
  const [formData, setFormData] = useState({
    projectNo: '',
    projectName: '',
    macroTask: '',
    microTask: '',
    status: 'NotStart',
  });

  const fetchAllTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/getTask'); // Endpoint for fetching all tasks
      const data = await response.json();
      setAllTasks(data);
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchAllTasks(); // Fetch all tasks when the component mounts
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/getProject');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        const getprojectno = data.map(item => ({
          value: item.projectNo,
          label: item.projectNo,
        }));
        const getprojectname = data.map(item => ({
          value: item.projectName,
          label: item.projectName,
        }));
        setGetProjectNo(getprojectno);
        setGetProjectName(getprojectname);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let isValid = true;
    const errors = {};
    if (!formData.projectNo) {
      errors.projectNo = "Please fill it";
      isValid = false;
    }
    if (!formData.projectName) {
      errors.projectName = "Please fill it";
      isValid = false;
    }
    if (!formData.macroTask) {
      errors.macroTask = "Please fill it";
      isValid = false;
    }
    if (!formData.microTask) {
      errors.microTask = "Please fill it";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      taskManagement(formData)
        .then(() => {
          setAlert(<Alert severity="success">Data successfully Added</Alert>);
          setFormData({
            projectNo: '',
            projectName: '',
            macroTask: '',
            microTask: '',
          });
          fetchAllTasks(); // Refresh the tasks after adding
          setTimeout(() => {
            setAlert(null);
          }, 7000);
        })
        .catch(() => {
          setAlert(<Alert severity="error">Data submission failed!</Alert>);
        });
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { projectNo: '', projectName: '', macroTask: '', microTask: '' } // Define your headers
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TaskTemplate');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'TaskTemplate.xlsx');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Add uploaded data to the table
        setUploadedTasks(jsonData);
        setShowUploadTable(true); // Show the upload table
        setAlert(<Alert severity="success">Excel file uploaded successfully!</Alert>);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmitUploadedTasks = () => {
    const promises = uploadedTasks.map(item => {
      return taskManagement(item)
        .catch(() => {
          setAlert(<Alert severity="error">Submission failed for some tasks!</Alert>);
        });
    });

    Promise.all(promises)
      .then(() => {
        setAlert(<Alert severity="success">All tasks successfully submitted!</Alert>);
        setUploadedTasks([]); // Clear uploaded tasks
        setShowUploadTable(false); // Hide upload table after submission
        fetchAllTasks(); // Refresh the all tasks table
      });
  };

  return (
    <div>
      <h4 style={{ marginTop: '10px', marginLeft: '19px', width: '290px' }}>Task Management</h4>
      <div className='project'>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Project No"
            name="projectNo"
            variant="standard"
            fullWidth
            select
            value={formData.projectNo || ''}
            onChange={handleChange}
            error={Boolean(formErrors.projectNo)}
            helperText={formErrors.projectNo}
            style={{ marginTop: '10px', width: '170px', marginLeft: '-75px' }}
          >
            {getProjectNo.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Project Name"
            name="projectName"
            variant="standard"
            fullWidth
            select
            value={formData.projectName || ''}
            style={{ marginTop: '10px', width: '210px', marginLeft: '190px' }}
            onChange={handleChange}
            error={Boolean(formErrors.projectName)}
            helperText={formErrors.projectName}
          >
            {getProjectName.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <br />
          <TextField
            label="Macro Task"
            name="macroTask"
            variant="standard"
            fullWidth
            multiline
            rows={1}
            value={formData.macroTask || ''}
            style={{ marginTop: '10px', width: '210px', marginLeft: '-40px' }}
            onChange={handleChange}
            error={Boolean(formErrors.macroTask)}
            helperText={formErrors.macroTask}
          />
          <TextField
            label="Micro Task"
            name="microTask"
            variant="standard"
            fullWidth
            multiline
            rows={1}
            value={formData.microTask || ''}
            style={{ marginTop: '10px', width: '210px', marginLeft: '120px' }}
            onChange={handleChange}
            error={Boolean(formErrors.microTask)}
            helperText={formErrors.microTask}
          />
          <Button
            type="submit"
            variant="contained"
            style={{ marginTop: '20px', width: '160px', marginLeft: '22px', backgroundColor: 'blue', color: 'white' }}
          >
            Add
          </Button>

          {/* Download Template Button */}
          <Button
            variant="contained"
            style={{ marginTop: '20px', marginLeft: '10px' }}
            startIcon={<ExcelIcon />}
            onClick={handleDownloadTemplate}
          >
            Download Template
          </Button>

          {/* Upload Excel File */}
          <input
            type="file"
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
            id="upload-excel"
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-excel">
            <Button
              variant="contained"
              component="span"
              style={{ marginTop: '20px', marginLeft: '10px' }}
            >
              Upload Excel
            </Button>
          </label>
        </form>

        {alert && (
          <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
            {alert}
          </Stack>
        )}
      </div>

      {/* All Tasks Table */}
      {!showUploadTable && (
        <div>
          <h5>All Tasks</h5>
          <table style={{ width: "100%", marginLeft: "10px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Project No</th>
                <th>Project Name</th>
                <th>Macro Task</th>
                <th>Micro Task</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.map((task, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{task.projectNo}</td>
                  <td>{task.projectName}</td>
                  <td>{task.macroTask}</td>
                  <td>{task.microTask}</td>
                  <td>
                    <UpdateIcon
                      style={{
                        cursor: "pointer",
                        color: "green",
                        marginRight: "10px",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Uploaded Tasks Table */}
      {showUploadTable && (
        <div>
          <h5>Uploaded Tasks</h5>
          <table style={{ width: "100%", marginLeft: "10px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Project No</th>
                <th>Project Name</th>
                <th>Macro Task</th>
                <th>Micro Task</th>
              </tr>
            </thead>
            <tbody>
              {uploadedTasks.map((project, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{project.projectNo}</td>
                  <td>{project.projectName}</td>
                  <td>{project.macroTask}</td>
                  <td>{project.microTask}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            variant="contained"
            style={{ marginTop: '20px', backgroundColor: 'green', color: 'white' }}
            onClick={handleSubmitUploadedTasks}
          >
            Submit Uploaded Tasks
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
