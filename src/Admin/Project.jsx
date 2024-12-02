import React, { useCallback, useState,useEffect } from 'react'
import './Admin.css'

import { TextField, MenuItem, Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Add, Description as ExcelIcon } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import { AccountMangement, getProjectsDashboard, projectdetailupload, updateProjectDetail } from '../Services/Services';
import UpdateIcon from "@mui/icons-material/Edit";

const Project = () => {
  const [formErrors, setFormErrors] = useState({ projectNo: '' });
  const [uploadedTasks, setUploadedTasks] = useState([]); // Store uploaded tasks
  const [showUploadTable, setShowUploadTable] = useState(false);
  const [showDetailTable,setShowDetailTable] = useState(true);
  const [alert, setAlert] = useState(null);
  const [getProjectDetail,setGetProjectDetail] = useState([]);
  const [updateFormData, setUpdateFormData] = useState(null);
  const [addButton,setAddButton]=useState(true);
  const [updateButton,setUpdateButton]=useState(false);
  const [cancelButton,setCancelButton] =useState(false);

  const [formData, setFormData] = useState({
    projectNo: '',
    projectName: '',
    projectStatus: '',
    projectStuck: '',
    nextMove: '',
    actualDate: '',
    fixingDate: '',

  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    getProjectsDashboardDeatil();
  }, []);

  const getProjectsDashboardDeatil = () => {
    getProjectsDashboard()
      .then((response) => {
        console.log('getProjectDashboard', response.data);
        setGetProjectDetail(response.data || []);
      })
      .catch((error) => {
        console.log('Error GetProjectDashboard details:', error);
      });
  };
  const handleDownloadTemplate = () => {
    const formattedDate = new Date(2024, 6, 7); // Months are 0-indexed in JavaScript, so 6 is July

    // Convert to Excel's date serial format
    const excelDate = (formattedDate - new Date(1900, 0, 1)) / (1000 * 60 * 60 * 24) + 25567;

    const templateData = [
      {
        projectNo: '',
        projectName: '',
        projectStatus: '',
        projectStuck: '',
        nextMove: '',
        actualDate: excelDate, // Store as Excel serial number
        fixingDate: excelDate, // Store as Excel serial number
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TaskTemplate');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'TaskTemplate.xlsx');
  };


  const handleFileUpload = (event) => {
    setShowDetailTable(false);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Format the date field properly
        const formattedData = jsonData.map(item => {
          if (item.actualDate) {
            // Check if the date is a valid number (Excel serial number format)
            const excelDate = new Date((item.actualDate - 25567) * 86400 * 1000); // Convert Excel serial number to JavaScript date
            if (!isNaN(excelDate.getTime())) {
              // Format the date as 'dd-mm-yyyy'
              const formattedDate = `${("0" + excelDate.getDate()).slice(-2)}-${("0" + (excelDate.getMonth() + 1)).slice(-2)}-${excelDate.getFullYear()}`;
              item.actualDate = formattedDate; // Replace with formatted date
            }
          }
          if (item.fixingDate) {
            // Same logic for fixingDate
            const excelDate = new Date((item.fixingDate - 25567) * 86400 * 1000); // Convert Excel serial number to JavaScript date
            if (!isNaN(excelDate.getTime())) {
              const formattedDate = `${("0" + excelDate.getDate()).slice(-2)}-${("0" + (excelDate.getMonth() + 1)).slice(-2)}-${excelDate.getFullYear()}`;
              item.fixingDate = formattedDate; // Replace with formatted date
            }
          }
          return item;
        });

        // Add the formatted data to the table
        setUploadedTasks(formattedData);
        setShowUploadTable(true); // Show the upload table
        setAlert(<Alert severity="success">Excel file uploaded successfully!</Alert>);
      };
      reader.readAsArrayBuffer(file);
    }
  };


  const handleSubmitUploadedTasks = () => {
    const promises = uploadedTasks.map(item => {
      return projectdetailupload(item)
        .catch(() => {
          setAlert(<Alert severity="error">Submission failed for some tasks!</Alert>);
        });
    });

    Promise.all(promises)
      .then(() => {
        setAlert(<Alert severity="success">All tasks successfully submitted!</Alert>);
        setUploadedTasks([]); // Clear uploaded tasks
        setShowUploadTable(false); // Hide upload table after submission
      });
  };

  const validate = () => {
    let isValid = true;
    const errors = {};
    if (!formData.projectNo) {
      errors.projectNo = "Please fill projectNo";
      isValid = false;
    }
    if (!formData.projectName) {
      errors.projectName = "Please fill projectName";
      isValid = false;
    }
    if (!formData.projectStatus) {
      errors.projectStatus = "Please fill projectStatus";
      isValid = false;
    }
    if (!formData.projectStuck) {
      errors.projectStuck = "Please fill projectStuck";
      isValid = false;
    }
    if (!formData.nextMove) {
      errors.nextMove = "Please fill nextMove";
      isValid = false;
    }
    if (!formData.actualDate) {
      errors.actualDate = "Please fill actualDate";
      isValid = false;
    }
    if (!formData.fixingDate) {
      errors.fixingDate = "Please fill fixingDate";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  }

  const close =()=>{
    setShowUploadTable(false);
    setFormData({
      projectNo: '',
      projectName: '',
      projectStatus: '',
      projectStuck: '',
      nextMove: '',
      actualDate: '',
      fixingDate: '',
    });
    setUpdateButton(false);
    setCancelButton(false);
    setAddButton(true);

  }  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Format the dates to 'dd-MM-yyyy' before submission
      const formattedData = {
        ...formData,
        actualDate: formatDate(formData.actualDate),
        fixingDate: formatDate(formData.fixingDate),
      };

      projectdetailupload(formattedData)
        .then(() => {

          setFormData({
            projectNo: '',
            projectName: '',
            projectStatus: '',
            projectStuck: '',
            nextMove: '',
            actualDate: '',
            fixingDate: '',
          
          });
          console.log('Upload successful');
        })
        .catch(() => {
          console.log('Upload failed');
        });
    }
  };

  // Utility function to format dates as 'dd-MM-yyyy'
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-'); // Split 'YYYY-MM-DD'
    return `${day}-${month}-${year}`; // Return 'dd-MM-yyyy'
  };

  const handleUpdateClick = (project) => {
    const formatToDateInput = (dateString) => {
        if (!dateString) return ""; // Handle empty dates gracefully
        const [day, month, year] = dateString.split("-"); // Assume `dd-MM-yyyy` format
        return `${year}-${month}-${day}`; // Convert to `YYYY-MM-DD`
    };

    setUpdateFormData(project); // Set the project you want to update
    setFormData({
        id:project.id,
        projectNo: project.projectNo,
        projectName: project.projectName,
        projectStatus: project.projectStatus,
        projectStuck: project.projectStuck,
        nextMove: project.nextMove,
        actualDate: formatToDateInput(project.actualDate), // Format for date input
        fixingDate: formatToDateInput(project.fixingDate), // Format for date input
        // Fill other fields if you have them
    });

    setAddButton(false);
    setUpdateButton(true);
    setCancelButton(true);
};


const handleUpdate = () => {
  if (validate()) {
      const formatDateForBackend = (dateString) => {
          if (!dateString) return null;
          return dateString; // Ensure it sends 'YYYY-MM-DD'
      };
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-'); // Split 'YYYY-MM-DD'
        return `${day}-${month}-${year}`; // Return 'dd-MM-yyyy'
      };

      const updatedData = {
          ...formData,
          actualDate: formatDate(formData.actualDate),
          fixingDate: formatDate(formData.fixingDate),
      };

      console.log("Sending data to backend:", updatedData); // Log the exact data

      updateProjectDetail(updatedData)
          .then((response) => {
              console.log("Backend response:", response.data);
              setAlert(<Alert severity="success">Data successfully updated</Alert>);

              // Reset form data
              setFormData({
                  projectNo: '',
                  projectName: '',
                  projectStatus: '',
                  projectStuck: '',
                  nextMove: '',
                  actualDate: '',
                  fixingDate: '',
              });

              setTimeout(() => {
                  setAlert(null);
              }, 7000);

              getProjectsDashboardDeatil();
              setUpdateButton(false);
              setCancelButton(false);
          })
          .catch((error) => {
              console.error("Error during update:", error);

              if (error.response && error.response.status === 409) {
                  setAlert(<Alert severity="warning">Already added</Alert>);
              } else {
                  setAlert(<Alert severity="error">An error occurred</Alert>);
              }

              setTimeout(() => {
                  setAlert(null);
              }, 7000);
          });
  }
};


  return (
    <div style={{ fontFamily: '"Roboto", sans-serif' }}>
      <div className='projectFiled'>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '39px' }}>

            <TextField
              label="Project No"
              name="projectNo"
              variant="standard"
              fullWidth
              type='text'
              value={formData.projectNo || ''}
              onChange={handleChange}
              error={Boolean(formErrors.projectNo)}
              helperText={formErrors.projectNo}
              style={{ width: '207px', marginLeft: '-30px', color: 'white', marginTop: '-37px' }}

            />
            <TextField
              label="projectName"
              name="projectName"
              variant="standard"
              fullWidth
              type='text'
              value={formData.projectName || ''}
              onChange={handleChange}
              error={Boolean(formErrors.projectName)}
              helperText={formErrors.projectName}
              style={{ width: '207px', marginLeft: '-10px', color: 'white', marginTop: '-37px' }}

            />
            <TextField
              label="projectStatus"
              name="projectStatus"
              variant="standard"
              fullWidth

              type='number'
              value={formData.projectStatus || ''}
              onChange={handleChange}
              error={Boolean(formErrors.projectStatus)}
              helperText={formErrors.projectStatus}
              style={{ width: '207px', marginLeft: '-10px', color: 'white', marginTop: '-37px' }}
            />
            <TextField
              label="projectStuck"
              name="projectStuck"
              variant="standard"
              fullWidth
              type='text' value={formData.projectStuck || ''}
              onChange={handleChange}
              error={Boolean(formErrors.projectStuck)}
              helperText={formErrors.projectStuck}
              style={{ width: '207px', marginLeft: '-10px', color: 'white', marginTop: '-37px' }}
            /><TextField
              label="nextMove"
              name="nextMove"
              variant="standard"
              fullWidth
              type='text'
              value={formData.nextMove || ''}
              onChange={handleChange}
              error={Boolean(formErrors.nextMove)}
              helperText={formErrors.nextMove}
              style={{ width: '207px', marginLeft: '-10px', color: 'white', marginTop: '-37px' }}
            />
            {/* <TextField
                            label=""
                            name="actualDate"
                            variant="standard"
                            fullWidth
                            type='date'
                            value={formData.actualDate || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.actualDate)}
                            helperText={formErrors.actualDate}
                            style={{ width: '207px', marginLeft: '-10px', color: 'white', marginTop: '-20px' }}

                        />
                        <TextField
                            label=""
                            name="fixingDate"
                            variant="standard"
                            fullWidth
                            type='date'
                            value={formData.fixingDate || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.fixingDate)}
                            helperText={formErrors.fixingDate}
                            style={{ width: '207px', marginLeft: '-1430px', color: 'white', marginTop: '70px' }}

                        /> */}

            <TextField
              label="actualDate"
              name="actualDate"
              variant="standard"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.actualDate || ""}
              style={{ width: '207px', marginLeft: '-10px', color: 'white', marginTop: '-20px' }}
              onChange={handleChange}
              error={Boolean(formErrors.actualDate)}
              helperText={formErrors.actualDate}
            />

            <TextField
              label="fixingDate"
              name="fixingDate"
              variant="standard"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.fixingDate || ""}
              style={{ width: '207px', marginLeft: '-1430px', color: 'white', marginTop: '70px' }}
              onChange={handleChange}
              error={Boolean(formErrors.fixingDate)}
              helperText={formErrors.fixingDate}
            />

          </div>

          {addButton && (
          <Button variant="contained" style={{marginTop:'-40px',marginLeft:'870px'}} type="submit">Submit</Button>

          )}
        </form>
        <Button style={{marginTop:'-440px',marginLeft:'1110px'}} className='downloadbutton' variant="contained" startIcon={<ExcelIcon />} onClick={handleDownloadTemplate}>Download Template</Button>
        <input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} id="upload-excel" onChange={handleFileUpload} />
        <label htmlFor="upload-excel">
          <Button className='projectuploadbutton'
          style={{marginTop:'-130px',marginLeft:'1170px'}}
            variant="contained"
            component="span"
          //style={{ marginTop: '70px', marginLeft: '10px' }}
          >
            Upload Excel
          </Button>
        </label>
      </div>
      {showUploadTable && (
        <div>
          <h5>Uploaded Tasks</h5>
          <Button
            variant="contained"
            style={{ marginTop: '20px',marginLeft:'978px', backgroundColor: 'green', color: 'white' }}
            onClick={handleSubmitUploadedTasks}
          >
            Submit Uploaded Account
          </Button>
          <Button variant="contained" style={{ marginTop: '20px',marginLeft:'10px'}}  onClickCapture={close}>Cancel</Button>
          <table style={{ width: "100%", marginLeft: "10px", marginTop: '70px', borderCollapse: "collapse", colour: 'blue' }}>

            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Project No</th>
                <th>Project Name</th>
                <th>projectStatus</th>
                <th>projectStuck</th>
                <th>nextMove</th>
                <th>actualDate</th>
                <th>fixingDate</th>
              </tr>
            </thead>
            <tbody>
              {uploadedTasks.map((project, index) => (
                <tr key={index} style={{ color: 'ActiveCaption' }}>
                  
                  <td>{index + 1}</td>
                  <td>{project.projectNo}</td>
                  <td>{project.projectName}</td>
                  <td>{project.projectStatus}</td>
                  <td>{project.projectStuck}</td>
                  <td>{project.nextMove}</td>
                  <td>{project.actualDate}</td>
                  <td>{project.fixingDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
      <div>
      {showDetailTable && (
        <div>
          <h5>ProjectDetail Tasks</h5>
          <table style={{ width: "100%", marginLeft: "10px", marginTop: '70px', borderCollapse: "collapse", colour: 'blue' }}>

            <thead>
              <tr>
                <th>Update</th>
                <th>Serial No.</th>
                <th>Project No</th>
                <th>Project Name</th>
                <th>projectStatus</th>
                <th>projectStuck</th>
                <th>nextMove</th>
                <th>actualDate</th>
                <th>fixingDate</th>
              </tr>
            </thead>
            <tbody>
              {getProjectDetail.map((project, index) => (
                <tr key={index} style={{ color: 'ActiveCaption' }}>
                  <td>
                  
                  <UpdateIcon
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                      color: "green",
                    }}
                    onClick={() => handleUpdateClick(project)}
                  />
                  
                </td>
                  <td>{index + 1}</td>
                  <td>{project.projectNo}</td>
                  <td>{project.projectName}</td>
                  <td>{project.projectStatus}</td>
                  <td>{project.projectStuck}</td>
                  <td>{project.nextMove}</td>
                  <td>{project.actualDate}</td>
                  <td>{project.fixingDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
      {updateButton && (
        <Button
          variant="contained"
          type="submit"
          onClick={handleUpdate}
          style={{ marginTop: "-1199px", marginLeft: "1090px" }}
        >
          Update
        </Button>
        )}
         {cancelButton && (
          <Button
            variant="contained"
            type="submit"
            onClick={close}
            style={{ marginTop: "-1209px", marginLeft: "230px" }}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}

export default Project