import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { getProjectMangement, projectmanagement, updateProject } from "../Services/Services";
import "./Projectmanagement.css";
import CloseIcon from "@mui/icons-material/Close"; // Importing CloseIcon
import UpdateIcon from "@mui/icons-material/Edit";

const ProjectManagement = () => {
  const [formErrors, setFormErrors] = useState({
    projectNo: "",
    projectName: "",
    startDate: "",
    endDate: "",
  });

  const [alert, setAlert] = useState(null);
  const [getProject, setGetProject] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Set the number of tasks to display per page
  // Calculate the indices of the first and last tasks to display
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const getAllProject = getProject.slice(indexOfFirstTask, indexOfLastTask);
  const [addButton,setAddButton]=useState(true);
  const [updateButton,setUpdateButton]=useState(false);
  // Calculate total pages
  const totalPages = Math.ceil(getProject.length / tasksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [formData, setFormData] = useState({
    projectNo: "",
    projectName: "",
    po_Amount: '',
    startDate: "",
    endDate: "",
    status: "notStart",
  });
  const [updateFormData, setUpdateFormData] = useState(null);

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
    if (!formData.po_Amount) {
      errors.po_Amount = "Please fill it";
      isValid = false;
    }
    if (!formData.startDate) {
      errors.startDate = "Please fill it";
      isValid = false;
    }
    if (!formData.endDate) {
      errors.endDate = "Please fill it";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
        console.log("formData: ", formData);
        projectmanagement(formData)
            .then((response) => {
                console.log("responseData:", response.data);
                
                // Check if the response contains project details
                if (response.data) {
                    setAlert(<Alert severity="success">Data successfully updated</Alert>);

                    const session_projectNo = response.data.projectNo;
                    const session_projectName = response.data.projectName;

                    // Store project details in session storage
                    sessionStorage.setItem('session_projectNo', session_projectNo);
                    sessionStorage.setItem('session_projectName', session_projectName);
                }

                // Reset form data
                setFormData({
                    projectNo: "",
                    projectName: "",
                    startDate: "",
                    endDate: "",
                });

                // Clear alert after 7 seconds
                setTimeout(() => {
                    setAlert(null);
                }, 7000);
            })
            .catch((error) => {
              // Handling error responses
              console.error("Error submitting project data:", error);
              if (error.response) { // If there is a response from the server
                  if (error.response.status === 409) {
                      setAlert(<Alert severity="warning">Project number already exists.</Alert>); // Handle 409 Conflict
                  } else if (error.response.status === 400) {
                      setAlert(<Alert severity="error">Bad Request: {error.response.data}</Alert>); // Handle 400 Bad Request
                  } else {
                      setAlert(<Alert severity="error">An error occurred: {error.message}</Alert>); // Generic error handling
                  }
              } else {
                  // For network or other types of errors
                  setAlert(<Alert severity="error">Network error: Please try again later.</Alert>);
              }
          });
    }
    setAddButton(true);
    setUpdateButton(false);
};


  const getData = () => {
    getProjectMangement()
      .then((response) => {
        setGetProject(response.data);
        setShowTable(true);
      })
      .catch((error) => {
      });
  };
  const handleCloseIconClick = () => {
    setFormData({
      projectNo: "",
      projectName: "",
      startDate: "",
      endDate: "",
    });
    setShowTable(false);
  };
  const handleUpdateClick = (project) => {
    setUpdateFormData(project); // Set the project you want to update
    setFormData({
      projectNo: project.projectNo,
      projectName: project.projectName,
      startDate: formatDate(project.startDate),
      endDate: formatDate(project.endDate),
      // Fill other fields if you have them
    });
    setAddButton(false);
  setUpdateButton(true);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
  };
const handleUpdate =()=>{
  console.log("uywuetfg")
  if (validate()) {
    console.log("formData: ", formData);
    updateProject(formData)
      .then((response) => {
        console.log("responseData:", response.data);
          setAlert(
            <Alert severity="success">Data successfully updated</Alert>
          );
        

        // Reset form data
        setFormData({
          projectNo: "",
          projectName: "",
          startDate: "",
          endDate: "",
          
        });

        setTimeout(() => {
          setAlert(null);
        }, 7000);
      })
      .catch((error) => {
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
}
  return (
    <div>
      <h4 style={{ marginTop: "10px", marginLeft: "19px", width: "290px" }}>
        Project Management
      </h4>
      <div className="projectmanagement">
        <form>
          <div style={{marginTop:'10px',marginLeft:'-190px'}}>
          <TextField
            label="Project No"
            name="projectNo"
            variant="standard"
            fullWidth
            sx={{ flexBasis: "23%" }}
            multiline
            rows={1}
            value={formData.projectNo || ""}
            style={{
              width: "120px",
              marginLeft: "-75px",
              gap: "10px",
              marginTop:'20px'
            }}
            onChange={handleChange}
            error={Boolean(formErrors.projectNo)}
            helperText={formErrors.projectNo}
          />
          <TextField
            label="Project Name"
            name="projectName"
            variant="standard"
            fullWidth
            sx={{ flexBasis: "13%" }}
            multiline
            rows={1}
            value={formData.projectName || ""}
            style={{  width: "210px", marginLeft: "22px",marginTop:'20px' }}
            onChange={handleChange}
            error={Boolean(formErrors.projectName)}
            helperText={formErrors.projectName}
          />
          <TextField
          label="po_Amount"
          name="po_Amount"
          variant="standard"
          fullWidth
         type="number"
          value={formData.po_Amount || ''}
          onChange={handleChange}
          error={Boolean(formErrors.po_Amount)}
          helperText={formErrors.po_Amount}
          style={{ width: '207px', marginLeft: '20px', color: 'white',marginTop:'20px' }}
         
      />
          <TextField
            label="Start Date"
            name="startDate"
            variant="standard"
            fullWidth
            sx={{ flexBasis: "23%" }}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate || ""}
            style={{
              width: "170px",
              marginRight: "220px",
              marginLeft: "20px",marginTop:'20px'
            }}
            onChange={handleChange}
            error={Boolean(formErrors.startDate)}
            helperText={formErrors.startDate}
          />
         
          <TextField
            label="End Date"
            name="endDate"
            variant="standard"
            fullWidth
            sx={{ flexBasis: "13%" }}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate || ""}
            style={{
              width: "210px",
              marginLeft: "-170px",marginTop:'20px'
            }}
            onChange={handleChange}
            error={Boolean(formErrors.endDate)}
            helperText={formErrors.endDate}
          />
          </div>
          {addButton && (
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            style={{
              width: "87px",
              marginLeft: "770px",
              backgroundColor: "blue",
              color: "white",
              marginTop:'10px'
            }}
          >
            Add
          </Button>
           )}
        </form>
        {alert && (
          <Stack sx={{ width: "100%", marginTop: "20px" }} spacing={2}>
            {alert}
          </Stack>
        )}
        <Button
          variant="contained"
          type="submit"
          onClick={getData}
          style={{ marginTop: "-70px", marginLeft: "1037px",width:'137px'   }}
        >
          View Project
        </Button>
        {updateButton && (
        <Button
          variant="contained"
          type="submit"
          onClick={handleUpdate}
          style={{ marginTop: "-70px", marginLeft: "230px" }}
        >
          Update
        </Button>
        )}
      </div>

      {showTable && (
        <div>
          <h5 style={{ marginLeft: "-1170px" }}>Allproject</h5>
          <table style={{ width: "70px", marginLeft: "10px" }}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>ProjectNumber</th>
                <th>ProjectName</th>
                <th>StartDate</th>
                <th>EndDate</th>

                <CloseIcon
                  onClick={handleCloseIconClick}
                  style={{
                    cursor: "pointer",
                    float: "right",
                    color: "blue",
                    marginLeft: "-10px",
                  }}
                />
              </tr>
            </thead>
            <tbody>
              {getAllProject.map((project, index) => (
                <tr key={index}>
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
                  <td>{project.projectNo}</td>
                  <td>{project.projectName}</td>
                  <td>{project.startDate}</td>
                  <td>{project.endDate}</td>
                  <td>{project.pid}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className="page-item">
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
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

export default ProjectManagement;
