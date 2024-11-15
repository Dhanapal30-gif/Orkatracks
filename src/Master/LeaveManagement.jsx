import React, { useState,useEffect } from 'react';
import { TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './LeaveManagement.css';
import Alert from '@mui/material/Alert';
import { setHoliday } from '../Services/Services';
import Stack from '@mui/material/Stack';

const LeaveManagement = () => {
  const [showTable, setShowTable] = useState(false);
  const [alert, setAlert] = useState(null); 
  const [updateData, setUpdateData] = useState([]);
  const [formData, setFormData] = useState({ holiDay: '', holiDayName: '' });
  const [formErrors, setFormErrors] = useState({ holiDay: '', holiDayName: '' });
  const [editIndex, setEditIndex] = useState(null); // Track which row is being edited

  const validate = () => {
    let isValid = true;
    const errors = {};

    if (!formData.holiDay) {
      errors.holiDay = "Please fill holidayDate";
      isValid = false;
    }

    if (!formData.holiDayName) {
      errors.holiDayName = "Please fill holiday name";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const addButton = () => {
    if (validate()) {
      if (editIndex !== null) {
        // Update existing row
        const updatedData = [...updateData];
        updatedData[editIndex] = formData;
        setUpdateData(updatedData);
        setEditIndex(null); // Reset editIndex
      } else {
        // Add new row
        setUpdateData((prevData) => [...prevData, formData]);
      }
      setFormData({ holiDay: '', holiDayName: '' }); // Reset form fields
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHoliday(updateData).then((response) => {
      setAlert(<Alert severity="success">Leave request submitted successfully!</Alert>);
      setTimeout(() => {
        setAlert(null);
      }, 7000); // 7 seconds
      setUpdateData([]);
      setShowTable(false);
    });
  };
console.log("updatelenfth",updateData.length)
  const handleDelete = (index) => {
    const updatedProjects = updateData.filter((_, i) => i !== index);
    setUpdateData(updatedProjects);
    
  };

  const handleEdit = (index) => {
    const projectToEdit = updateData[index];
    setFormData({ ...projectToEdit });
    setEditIndex(index); // Set editIndex to the row being edited
  };
  useEffect(() => {
    if (updateData.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
    
  }, [updateData]);
  return (
    <div >
      <div className='leaveManagaement'>
      <form>
      <TextField
          label="holiDay"
          name="holiDay"
          variant="standard"
          fullWidth
          sx={{ flexBasis: '13%' }}
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.holiDay}
          style={{ width: '210px', marginTop: '10px', marginLeft: '-190px' }}
          onChange={handleChange}
          error={Boolean(formErrors.holiDay)}
          helperText={formErrors.holiDay}
        />
        <TextField
          label="holiDayName"
          name="holiDayName"
          variant="outlined"
          fullWidth
           type="textarea"
          sx={{ flexBasis: '13%', marginLeft: '20px' }}
          value={formData.holiDayName}
          onChange={handleChange}
          error={Boolean(formErrors.holiDayName)}
          helperText={formErrors.holiDayName}
          style={{ width: '70%', marginTop: '90px', marginLeft: '-210px' }}

        />
      
        <Button variant="contained" onClick={addButton} style={{ marginTop: '190px' }}>
          Add
        </Button>
      </form>
      </div>
      {showTable && (
        <div style={{marginLeft:'770px',marginTop:'-370px'}}>
          <h4>Leave Details</h4>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Holiday</TableCell>
                  <TableCell>Holiday Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {updateData.map((leave, index) => (
                  <TableRow key={index}>
                    <TableCell>{leave.holiDay}</TableCell>
                    <TableCell>{leave.holiDayName}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(index)} variant="outlined" size="small">
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(index)} variant="outlined" color="error" size="small">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant="contained" color="primary"  onClick={handleSubmit} style={{ marginTop: '20px' }}>
            Submit
          </Button>
        </div>
      )}
      <Stack sx={{ width: '70%',marginTop:'-290px', marginLeft:'270px'}} spacing={2}>
        {alert}
      </Stack>
    </div>
    
  );
};

export default LeaveManagement;
