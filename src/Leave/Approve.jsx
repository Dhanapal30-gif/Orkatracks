import React, { useState, useEffect } from 'react';
import './Approver.css';
import { updateLeave } from '../Services/Services';
import Alert from '@mui/material/Alert';

function Approve() {
  const [leave, setLeave] = useState([]);
  const [approvedleave, setApprovedLeave] = useState([]);
  const [getLeave, setGetLeave] = useState([]);
  const [showModal, setShowModal] = useState(false); // Controls the popup visibility
  const [comments, setComments] = useState(''); // Stores comments
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Tracks selected project ID for rejection
  const [selectedLeave, setSelectedLeave] = useState(null); // State to store selected leave
  const [alert, setAlert] = useState(null); // State to manage the alert

  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    fHDay: '',
    status: '',
  });


  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/leaveController/getLeave');
      const data = await response.json();
      setGetLeave(data);

      // Filter leave requests by 'waiting for Approved' status
      setLeave(data.filter(project => project.status === 'waiting for Approved'));
      setApprovedLeave(data.filter(project => project.status === 'approved'));

    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []); // Empty dependency array to run only once when component mounts

  const handleRejectClick = (projectId) => {
    setSelectedProjectId(projectId); // Track which project is being rejected
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setComments(''); // Clear the comments when closing
  };

  const handleSubmit = (action, project) => {
    if (action === 'approve') {
      // Set formData to display the updated values in the UI if needed
      setFormData({
        empId: project.empId,
        empName: project.empName,
        leaveType: project.leaveType,
        startDate: project.startDate,
        endDate: project.endDate,
        reason: project.reason,
        fHDay: '',
        status: 'approved',
      });
  
      // Directly use the project object to send to the backend
      updateLeave({
        leaveId:project.leaveId,
        empId: project.empId,
        empName: project.empName,
        leaveType: project.leaveType,
        startDate: project.startDate,
        endDate: project.endDate,
        reason: project.reason,
        fHDay:project.fHDay,
        status: 'approved',
      })
        .then((response) => {
          console.log('Leave request response:', response);
          setAlert(<Alert severity="success">Leave request submitted successfully!</Alert>);
          setTimeout(() => setAlert(null), 7000);
          fetchProjects();
        })
        .catch((error) => {
          setAlert(<Alert severity="error">Leave request submission failed!</Alert>);
        });
    }
  };

  return (
    <div>
      <h6 style={{ marginTop: '-67px', marginLeft: '19px', width: '290px' }}>Projects</h6>
      <div className='getgetproject'>
        {leave.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: 'lightblue',
              color: '#fff',
              borderRadius: '8px',
              marginTop: '3px',
              width: '28%',
              marginBottom: '10px',
              padding: '10px',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h5 className="gradient-text">{project.status}</h5>
              <button onClick={() => handleSubmit('approve', project)}>Approve</button>
              <button className='rejectButton' onClick={() => handleRejectClick(project.id)}>Reject</button>
              <p>Employee ID: {project.empId}</p>
              <p>Employee Name: {project.empName}</p>
              <p>Leave Type: {project.leaveType}</p>
              <p>Reason: {project.reason}</p>
              <p>Start Date: {project.startDate}</p>
              <p>End Date: {project.endDate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Leave Request</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter comments"
              rows="4"
              style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleSubmit('reject')}>Done</button>
              <button onClick={handleCloseModal} style={{ marginLeft: '10px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Approve;
