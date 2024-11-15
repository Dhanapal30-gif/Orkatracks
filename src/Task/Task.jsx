import { Button, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import './Task.css';
import { getTask, updateTask } from '../Services/Services';
import UpdateIcon from '@mui/icons-material/Edit';

const Task = () => {
  const setempId = sessionStorage.getItem('empId');
  const [showTable, setShowTable] = useState(true);
  const [getData, setGetData] = useState([]);
  const [form,setForm]=useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input
  const [filteredData, setFilteredData] = useState(getData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Set the number of tasks to display per page

  // Calculate the indices of the first and last tasks to display
  const [employee, setEmployee] = useState([]);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = employee.slice(indexOfFirstTask, indexOfLastTask);

  // Calculate total pages
  const totalPages = Math.ceil(employee.length / tasksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [formData, setFormData] = useState({
    empId: setempId || '',
    id:'7989',
    projectNo: '',
    projectName: '',
    macroTask: '',
    microTask: '',
    inCharge: '',
    startDate: '',
    endDate: '',
    secondCloseDate: '',
    remark: '',
    status: '', // Make sure the initial value is defined
  });

  useEffect(() => {
    getAllData();
    let filtered = getData;

      if (searchTerm) {
        // Normalize the search term to lowercase and remove spaces
        const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s+/g, '');

        filtered = filtered.filter((task) => {
          const normalizedProjectNo = task.projectNo.toLowerCase().replace(/\s+/g, '');
          const normalizedStatus = task.status.toLowerCase().replace(/\s+/g, '');

          // Search in projectNo and status (after removing spaces and converting to lowercase)
          return (
            normalizedProjectNo.includes(normalizedSearchTerm) || 
            normalizedStatus.includes(normalizedSearchTerm)
          );
        });
      }
      setFilteredData(filtered);
      const interval = setInterval(() => {
        getAllData();
      }, 30000); // 30000 ms = 30 seconds
  
      // Cleanup the interval when the component unmounts
      return () => clearInterval(interval);
  }, [searchTerm, getData]);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term on input change
  };
  const getAllData = () => {
    getTask()
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];

        console.log('API Response:', data); 

                    const Id = data.id;
                    console.log("id",Id)
                    sessionStorage.setItem('Id',Id);
        console.log(sessionStorage.getItem('Id',Id),"sessionStorage");
        setGetData(response.data || []);
        setEmployee(response.data);

      })
      .catch(error => {
        console.error(error);
      });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  };
  const handleUpdate = (taskData) => {
    console.log(`Edit project with number: ${taskData.projectNo}`);
    setForm(true);
    setFormData({
      id:taskData.id,
      empId: setempId || '', // Ensure empId is included
      projectNo: taskData.projectNo,
      projectName: taskData.projectName,
      macroTask: taskData.macroTask,
      microTask: taskData.microTask,
      inCharge: taskData.inCharge,
      startDate: formatDate(taskData.startDate),
      endDate: formatDate(taskData.endDate),
      secondCloseDate:formatDate( taskData.secondCloseDate),
      remark: taskData.remark,
      status: taskData.status || 'Notstarted', // Ensure status is defined
    });
  };
  // const close =()=>{
  //   setShowTable(false);
  
  // }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formData", formData);
    updateTask(formData).then((response) => {
      console.log("formData", formData);
      getAllData();
      setFormData({
        projectNo: '',
        projectName: '',
        macroTask: '',
        microTask: '',
        inCharge: '',
        startDate: '',
        endDate: '',
        status: '',
      });
      setForm(false);

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
      <h4 style={{ margin: '20px', textAlign: 'left', marginTop: '10px', padding: '10px', backgroundColor: 'blueviolet', color: 'white' }}>
        TaskStatus
        {/* <Button variant="contained" style={{ marginLeft: '1010px' }} onClick={getAllData}>All Task</Button> */}
      </h4>

      <div>
        {form &&
        <form style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }} onSubmit={handleSubmit}>
          <TextField label="Project No" name="projectNo" variant="outlined" fullWidth sx={{ flexBasis: '13%', marginLeft: '20px' }} value={formData.projectNo} onChange={handleChange} required />
          <TextField label="Project Name" name="projectName" variant="outlined" fullWidth sx={{ flexBasis: '23%' }} value={formData.projectName} onChange={handleChange} required />
          <TextField label="Macro Task" name="macroTask" variant="outlined" fullWidth sx={{ flexBasis: '23%' }} value={formData.macroTask} onChange={handleChange} required />
          <TextField label="Micro Task" name="microTask" type='textarea' fullWidth sx={{ flexBasis: '23%' }} multiline rows={2} value={formData.microTask} onChange={handleChange} required/>
          <TextField label="Incharge" name="incharge" variant="outlined" fullWidth sx={{ flexBasis: '13%', marginLeft: '20px' }} value={formData.inCharge} onChange={handleChange} required/>
          <TextField label="Start Date" name="startDate" variant="outlined" fullWidth sx={{ flexBasis: '23%' }} type="date" InputLabelProps={{ shrink: true }} value={formData.startDate} onChange={handleChange} required/>
          <TextField label="End Date" name="endDate" variant="outlined" fullWidth sx={{ flexBasis: '23%' }} type="date" InputLabelProps={{ shrink: true }} value={formData.endDate} onChange={handleChange} required/>
          <TextField label="secondCloseDate" name="secondCloseDate" variant="outlined" fullWidth sx={{ flexBasis: '23%' }} type="date" InputLabelProps={{ shrink: true }} value={formData.secondCloseDate} onChange={handleChange} />
          <TextField label="remark" name="remark" type='textarea' fullWidth sx={{ flexBasis: '23%' }} multiline rows={2} value={formData.remark} onChange={handleChange} style={{ marginLeft: '17px' }} />

          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            sx={{ flexBasis: '23%', marginTop: '16px' }}
            InputLabelProps={{ shrink: true }}
            value={formData.status} // Controlled value
            select // This makes the TextField behave like a dropdown
            onChange={handleChange}
            name="status"
          >
            <MenuItem value="Notstarted" >Notstarted</MenuItem>
            <MenuItem value="Ongoing" >Ongoing</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>

         <Button variant="contained" type="submit" style={{ marginTop: '16px' }}>Add</Button> 
         {/* <Button variant="contained" style={{ marginTop: '16px' }} onClick={close()}>Close</Button>  */}

        </form>
      }
        {showTable && 
          <div>
            <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by status"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            marginLeft:'1090px',
            border: '1px solid #ccc',
          }}
        />
      </div>
            <table>
              <thead>
                <tr>
                  <th>Update</th>
                  <th>id</th>
                  <th>ProjectNo</th>
                  <th>ProjectName</th>
                  <th>MacroTask</th>
                  <th>MicroTask</th>
                  <th>Incharge</th>
                  <th>StartDate</th>
                  <th>EndDate</th>
                  <th>secondCloseDate</th>
                  <th>remark</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {( filteredData ||currentTasks || []).map((taskData, index) => (
                  <tr key={index}>
                    <td>
                      <UpdateIcon
                        style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }}
                        onClick={() => handleUpdate(taskData)}
                      />
                    </td>
                    <td>{taskData.id}</td>
                    <td>{taskData.projectNo}</td>
                    <td>{taskData.projectName}</td>
                    <td>{taskData.macroTask}</td>
                    <td>{taskData.microTask}</td>
                    <td>{taskData.inCharge}</td>
                    <td>{formatDate(taskData.startDate)}</td>
                    <td>{formatDate(taskData.endDate)}</td>
                    <td>{formatDate(taskData.secondCloseDate)}</td>
                    <td>{taskData.remark}</td>
                    <td className={getStatusClass(taskData.status)}>{taskData.status}</td>
                    </tr>
                ))}
              </tbody>
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
            </table>
          </div>
        } 
      </div>
    </div>
  );
}

export default Task;