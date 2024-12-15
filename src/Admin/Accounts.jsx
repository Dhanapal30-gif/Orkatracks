import React, { useState, useEffect } from 'react'
import './Admin.css'
import { TextField, Button, MenuItem } from '@mui/material';
import { AccountMangement, deletedatad, getAllProjectDeatil, taskManagement } from '../Services/Services';
import * as XLSX from 'xlsx';
import Alert from '@mui/material/Alert';
import { Add, Description as ExcelIcon } from '@mui/icons-material';
import { url } from '../appConfig';
import { saveAs } from 'file-saver';

const Accounts = () => {
    const [getProjectDetail, setGetProjectDetail] = useState([]);
    const [formErrors, setFormErrors] = useState({ projectNo: '' });
    const [uploadedTasks, setUploadedTasks] = useState([]); // Store uploaded tasks
  const [showUploadTable, setShowUploadTable] = useState(false);
  const [alert, setAlert] = useState(null);
  
    const [formData, setFormData] = useState({
        projectNo: '',
        projectName: '',
        catagery: '',
        particulars: '',
        //po_Amount: '',
        debit_Amount: '',
        credit_Amount: '',
        date:'',

    });
    const [getProject, setGetProject] = useState({
        projectNo: '',
        projectName: '',
    });

    const handleDownloadTemplate = () => {
      // Format the date as 'dd-mm-yyyy'
      const formattedDate = new Date(2024, 6, 7); // Months are 0-indexed in JavaScript, so 6 is July
      const dateString = `${("0" + formattedDate.getDate()).slice(-2)}-${("0" + (formattedDate.getMonth() + 1)).slice(-2)}-${formattedDate.getFullYear()}`;
    
      const templateData = [
        { 
          projectNo: '', 
          projectName: '', 
          catagery: '', 
          particulars: '', 
          po_Amount: '', 
          debit_Amount: '', 
          credit_Amount: '', 
          date: dateString, 
          planedBudjet:'',
          exType:'', // Use the formatted date string
          refernceProjectNo:'',
          amountSpent:'',
          emi:'',
          outstandingAmount:'',
          bankBalance:'',
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
        if (item.date) {
          // Check if the date is a valid number (Excel serial number format)
          const excelDate = new Date((item.date - (25567 + 2)) * 86400 * 1000); // Excel date to JS date
          if (!isNaN(excelDate.getTime())) {
            // Format the date as 'dd-mm-yyyy'
            const formattedDate = `${("0" + excelDate.getDate()).slice(-2)}-${("0" + (excelDate.getMonth() + 1)).slice(-2)}-${excelDate.getFullYear()}`;
            item.date = formattedDate; // Replace with formatted date
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
          return AccountMangement(item)
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
    
    

    useEffect(() => {
        getProDeatil();

    }, []);
    //Handelhange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'projectNo' && getProjectDetail.length > 0) {
            const selectedproject = getProjectDetail.find(
                (project) => `${project.projectNo}` === value
            );
            if (selectedproject) {
                setGetProject({

                    projectNo: value,
                    projectName: selectedproject.projectName,
                });
            }
        }
    };
    //getprojectdetail
    const getProDeatil = () => {
        getAllProjectDeatil()
            .then((response) => {

                console.log("getAllProjectDeatil", response.data);
                setGetProjectDetail(Array.isArray(response.data) ? response.data : []);
            })
            .catch((error) => {
                console.log('Error fetching employee details:', error);
            });
    };

    //validateion
    const validate = () => {
        let isValid = true;
        const errors = {};

        if (!formData.projectNo) {
            errors.projectNo = "Please fill projectNo";
            isValid = false;
        }

        if (!formData.projectName) {
            errors.projectName = "Please fill projectName name";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };
//project fetch 


    const handleDelete =()=>{
      deletedatad()
      .then((response)=>{
        console.log("Deleted sucessfully")

      })

    }

    return (
        <div >
            <div className='Accoun_Ui'>
                <form>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '19px' }}>
                    <TextField
          label="date"
          name="date"
          variant="standard"
          fullWidth
          sx={{ flexBasis: '13%' }}
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          style={{ width: '210px', marginTop: '10px', marginLeft: '50px' }}
          onChange={handleChange}
          error={Boolean(formErrors.date)}
          helperText={formErrors.date}
        />
                        <TextField
                            label="Project No"
                            name="projectNo"
                            variant="standard"
                            fullWidth
                            select
                            value={getProject.projectNo || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.projectNo)}
                            helperText={formErrors.projectNo}
                            style={{ width: '207px', marginLeft: '-10px', color: 'white' }}
                           
                        />
                        <TextField
                            label="ProjectName"
                            name="projectName"
                            variant="standard"
                            fullWidth
                            select
                            value={getProject.projectName || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.projectName)}
                            helperText={formErrors.projectName}
                            style={{ width: '207px', marginLeft: '40px', color: 'white' }}
                           
                        />
                         <TextField
                            label="catagery"
                            name="catagery"
                            variant="standard"
                            fullWidth
                             type="textarea"
                            value={formData.catagery || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.catagery)}
                            helperText={formErrors.catagery}
                            style={{ width: '207px', marginLeft: '70px', color: 'white' }}
                            
                        />
                        <TextField
                            label="particulars"
                            name="particulars"
                            variant="standard"
                            fullWidth
                            type="textarea"

                            value={formData.particulars || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.particulars)}
                            helperText={formErrors.particulars}
                            style={{ width: '207px', marginLeft: '80px', color: 'white' }}
                           
                        />
                        {/* <TextField
                            label="po_Amount"
                            name="po_Amount"
                            variant="standard"
                            fullWidth
                           type="number"
                            value={formData.po_Amount || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.po_Amount)}
                            helperText={formErrors.po_Amount}
                            style={{ width: '207px', marginLeft: '80px', color: 'white' }}
                           
                        /> */}
                        <TextField
                            label="debit_Amount"
                            name="debit_Amount"
                            variant="standard"
                            fullWidth
                           type="number"

                            value={formData.debit_Amount || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.debit_Amount)}
                            helperText={formErrors.debit_Amount}
                            style={{ width: '207px', marginLeft: '80px', color: 'white' }}
                           
                        />
                        <TextField
                            label="credit_Amount"
                            name="credit_Amount"
                            variant="standard"
                            fullWidth
                           type="number"
                            value={formData.credit_Amount || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.credit_Amount)}
                            helperText={formErrors.credit_Amount}
                            style={{ width: '207px', marginLeft: '80px', color: 'white' }}                         
                        />
                    </div>
                    <Button
            type="submit"
            variant="contained"
            style={{
              marginTop: '70px',
              width: '160px',
              marginLeft: '890px',
              backgroundColor: 'blue',
              color: 'white',
            }}
          >
            Add
          </Button>
          <Button
            variant="contained"
            style={{ marginTop: '70px', marginLeft: '10px' }}
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
              style={{ marginTop: '70px', marginLeft: '10px' }}
            >
              Upload Excel
            </Button>
          </label>
          <button  onClick={handleDelete}>Delete</button>

                </form>
                {showUploadTable && (
        <div>
          <h5>Uploaded Tasks</h5>
          <table style={{ width: "100%", marginLeft: "10px",marginTop:'70px',borderCollapse: "collapse",colour:'blue' }}>
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
                <tr key={index} style={{color:'ActiveCaption'}}>
                  <td>{index + 1}</td>
                  <td>{project.projectNo}</td>
                  <td>{project.projectName}</td>
                  <td>{project.catagery}</td>
                  <td>{project.po_Amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            variant="contained"
            style={{ marginTop: '20px', backgroundColor: 'green', color: 'white' }}
            onClick={handleSubmitUploadedTasks}
          >
            Submit Uploaded Account
          </Button>
        </div>
      )}
            </div>

        </div>
    )
}

export default Accounts