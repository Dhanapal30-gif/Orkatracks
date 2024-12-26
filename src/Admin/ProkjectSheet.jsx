import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import './ProjectSheet.css'
import { getProjectsDashboard, getRiskDashboard, getServiceDashboard, getStageDashboard, projectdetailupload, projectRiskFactorupload, projectServiceupload, projectStageupload } from '../Services/Services';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, LinearProgress, colors, } from "@mui/material";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const ProkjectSheet = () => {
    const [formData, setFormData] = useState({ projectNo: '', projectName: '', proStartDate: '', proPlanedDate: '', proActualDate: '' })
    const [stageFormData, setStageFormData] = useState({ projectNo: '', projectName: '', stageStartDate: '', stageEndDate: '', stageStatus: '' })
    const [riskFactoreFormData, setRiskFactoreFormDat] = useState({ projectNo: '', projectName: '', riskFactor: '', riskStartDate: '', riskDate: '', riskStaus: '' })
    const [serviceFormData, setServiceFormData] = useState({ projectNo: '', projectName: '', serviceFactor: '', serviceStatus: '' })
    const [formErrors, setFormErrors] = useState({});

    const [showProject, steShowProject] = useState(false);
    const [showStage, setShowStage] = useState(false);
    const [showRiskFactor, setShowRiskFactor] = useState(false);
    const [showService, setShowService] = useState(false);

    const [projectUpload, setProjectUpload] = useState([])
    const [stageUpload, setStageUpload] = useState([])
    const [riakFactorUpload, setRiskFactorUpload] = useState([])
    const [serviceUpload, setServiceUpload] = useState([])

    const [projectDataDefine, setProjectDataDefine] = useState(0)
    const [stageDataDefine, setStageDataDefine] = useState(0)
    const [riskFactorDataDefine, setRiskFactorDataDefine] = useState(0)
    const [serviceDataDefine, setServiceDataDefine] = useState(0)

    const [showprojectDataDefineTable, setShowProjectDataDefineTable] = useState(false)
    const [showstageDataDefineTable, setShowStageDataDefineTable] = useState(false)
    const [showriskFactorDataDefineTable, setShowRiskFactorDataDefineTable] = useState(false)
    const [showserviceDataDefineTable, setShowServiceDataDefineTable] = useState(false)

    const [getProjectDetail, setGetProjectDetail] = useState([]);
    const [getStageDetail, setGetStageDetail] = useState([]);
    const [getRiskFactorDetail, setRiskFactorDetail] = useState([]);
    const [getServiceDetail, setGetServiceDetail] = useState([]);


    const [showProjectViewTable, setShowProjectViewTable] = useState(false);
    const [showstageViewTable, setShowStageViewTable] = useState(false)
    const [showriskFactorViewTable, setShowRiskFactorViewTable] = useState(false)
    const [showserviceViewTable, setShowServiceViewTable] = useState(false)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const prijectdatavalueset = (event) => {
        handleFileUpload(event, 1); // Pass 1 for Project
    };

    const stagedatavalueset = (event) => {
        handleFileUpload(event, 2); // Pass 2 for Stage
    };

    const riskFactordatavalueset = (event) => {
        handleFileUpload(event, 3); // Pass 3 for Risk Factor
    };

    const servicedatavalueset = (event) => {
        handleFileUpload(event, 4); // Pass 4 for Service
    };

    const clocePopup = () => {
        setShowProjectDataDefineTable(false)
        
        setShowProjectViewTable(false)
        setShowStageViewTable(false)
        setShowRiskFactorViewTable(false)
        setShowServiceViewTable(false)
    }
    const showProjectDetail = () => {
        steShowProject(true)
        setShowStage(false)
        setShowRiskFactor(false)
        setShowService(false)
    }
    const showStageDetail = () => {
        steShowProject(false)
        setShowStage(true)
        setShowRiskFactor(false)
        setShowService(false)
    }
    const showRiskFactorDetail = () => {
        steShowProject(false)
        setShowStage(false)
        setShowRiskFactor(true)
        setShowService(false)
    }
    const showServiceDetail = () => {
        steShowProject(false)
        setShowStage(false)
        setShowRiskFactor(false)
        setShowService(true)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const stagehandleChange = (e) => {
        const { name, value } = e.target;
        setStageFormData({ ...stageFormData, [name]: value });
    };
    const riskFactorhandleChange = (e) => {
        const { name, value } = e.target;
        setRiskFactoreFormDat({ ...riskFactoreFormData, [name]: value });
    };
    const servicehandleChange = (e) => {
        const { name, value } = e.target;
        setServiceFormData({ ...serviceFormData, [name]: value });
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
        setFormErrors(errors);
        return isValid;
    }
    const validateStage = () => {
        let isValid = true;
        const errors = {};
        if (!stageFormData.projectNo) {
            errors.projectNo = "Please fill projectNo";
            isValid = false;
        }
        if (!stageFormData.projectName) {
            errors.projectName = "Please fill projectName";
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    }
    const validateRiskFactor = () => {
        let isValid = true;
        const errors = {};
        if (!riskFactoreFormData.projectNo) {
            errors.projectNo = "Please fill projectNo";
            isValid = false;
        }
        if (!riskFactoreFormData.projectName) {
            errors.projectName = "Please fill projectName";
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    }
    const validateService = () => {
        let isValid = true;
        const errors = {};
        if (!serviceFormData.projectNo) {
            errors.projectNo = "Please fill projectNo";
            isValid = false;
        }
        if (!serviceFormData.projectName) {
            errors.projectName = "Please fill projectName";
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            // Optimistic feedback (clear form immediately)
            setFormData({
                projectNo: '', projectName: '', proStartDate: '', proPlanedDate: '', proActualDate: '',
            });

            // Submit to backend
            await projectdetailupload(formData);

            console.log("Submission successful!");
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };
    const handleStageSubmit = async (e) => {
        e.preventDefault();

        if (!validateStage()) return;

        try {
            // Optimistic feedback (clear form immediately)
            setStageFormData({
                projectNo: '', projectName: '', stageStartDate: '', stageEndDate: '', stageStatus: '',
            });

            // Submit to backend
            await projectStageupload(stageFormData);

            console.log("Submission successful!");
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };
    const handleRiskFactorSubmit = async (e) => {
        e.preventDefault();

        if (!validateRiskFactor()) return;

        try {
            // Optimistic feedback (clear form immediately)
            setRiskFactoreFormDat({
                projectNo: '', projectName: '', riskFactor: '', riskStartDate: '', riskStaus: '',
            });

            // Submit to backend
            await projectRiskFactorupload(riskFactoreFormData);

            console.log("Submission successful!");
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };
    const handleServiceSubmit = async (e) => {
        e.preventDefault();

        if (!validateService()) return;

        try {
            // Optimistic feedback (clear form immediately)
            setServiceFormData({
                projectNo: '', projectName: '', serviceFactor: '', serviceStatus: ''
            });

            // Submit to backend
            await projectServiceupload(serviceFormData);

            console.log("Submission successful!");
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    const handleDownloadProject = () => {
        // Format the date as 'dd-mm-yyyy'
        const formattedDate = new Date(2024, 6, 7); // Months are 0-indexed in JavaScript, so 6 is July
        const dateString = `${("0" + formattedDate.getDate()).slice(-2)}-${("0" + (formattedDate.getMonth() + 1)).slice(-2)}-${formattedDate.getFullYear()}`;

        const templateData = [
            {
                projectNo: '',
                projectName: '',
                proStartDate: dateString,
                proActualDate: dateString,
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'TaskTemplate');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'ProjectSheet.xlsx');
    };
    const handleDownloadStage = () => {
        // Format the date as 'dd-mm-yyyy'
        const formattedDate = new Date(2024, 6, 7); // Months are 0-indexed in JavaScript, so 6 is July
        const dateString = `${("0" + formattedDate.getDate()).slice(-2)}-${("0" + (formattedDate.getMonth() + 1)).slice(-2)}-${formattedDate.getFullYear()}`;

        const templateData = [
            {
                projectNo: '',
                projectName: '',
                stageStartDate: dateString,
                stageEndDate: dateString,
                stageStatus: '',
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'TaskTemplate');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'StageSheet.xlsx');
    };
    const handleDownloadRiskFactor = () => {
        // Format the date as 'dd-mm-yyyy'
        const formattedDate = new Date(2024, 6, 7); // Months are 0-indexed in JavaScript, so 6 is July
        const dateString = `${("0" + formattedDate.getDate()).slice(-2)}-${("0" + (formattedDate.getMonth() + 1)).slice(-2)}-${formattedDate.getFullYear()}`;

        const templateData = [
            {
                projectNo: '',
                projectName: '',
                riskFactor: '',
                riskStartDate: dateString,
                riskDate: dateString,
                riskStaus: '',

            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'TaskTemplate');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'RiskFactorSheet.xlsx');
    };
    const handleDownloadService = () => {
        // Format the date as 'dd-mm-yyyy'
        const formattedDate = new Date(2024, 6, 7); // Months are 0-indexed in JavaScript, so 6 is July
        const dateString = `${("0" + formattedDate.getDate()).slice(-2)}-${("0" + (formattedDate.getMonth() + 1)).slice(-2)}-${formattedDate.getFullYear()}`;

        const templateData = [
            {
                projectNo: '',
                projectName: '',
                serviceFactor: '',
                serviceStatus: '',
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'TaskTemplate');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'ServiceSheet.xlsx');
    };

    const handleFileUpload = (event, dataType) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Format date fields if necessary
                const formattedData = jsonData.map(item => {
                    if (item.date) {
                        const excelDate = new Date((item.date - (25567 + 2)) * 86400 * 1000);
                        if (!isNaN(excelDate.getTime())) {
                            item.date = `${("0" + excelDate.getDate()).slice(-2)}-${("0" + (excelDate.getMonth() + 1)).slice(-2)}-${excelDate.getFullYear()}`;
                        }
                    }
                    return item;
                });

                if (dataType === 1) {
                    setProjectUpload(formattedData);
                    setShowProjectDataDefineTable(true)
                    console.log("Project Data Uploaded");
                } else if (dataType === 2) {
                    setStageUpload(formattedData);
                    setShowStageDataDefineTable(true)
                    console.log("Stage Data Uploaded");
                } else if (dataType === 3) {
                    setRiskFactorUpload(formattedData);
                    setShowRiskFactorDataDefineTable(true)
                    console.log("Risk Factor Data Uploaded");
                } else if (dataType === 4) {
                    setServiceUpload(formattedData);
                    setShowServiceDataDefineTable(true)
                    console.log("Service Data Uploaded");
                }

                // Reset the file input
                event.target.value = '';
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleSubmitProject = () => {
        const promises = projectUpload.map(item => {
            return projectdetailupload(item)
                .catch(() => {
                    console.log("uygwuet")
                });
        });

        Promise.all(promises)
            .then(() => {
                setProjectUpload([]); // Clear uploaded tasks
                setShowProjectDataDefineTable(false); // Hide upload table after submission
            });
    };
    const handleSubmitStage = () => {
        const promises = stageUpload.map(item => {
            return projectStageupload(item)
                .catch(() => {
                    console.log("uygwuet")
                });
        });

        Promise.all(promises)
            .then(() => {
                setStageUpload([]); // Clear uploaded tasks
                setShowStageDataDefineTable(false)
            });
    };
    const handleSubmitRiskFactor= () => {
        const promises = riakFactorUpload.map(item => {
            return projectRiskFactorupload(item)
                .catch(() => {
                    console.log("uygwuet")
                });
        });

        Promise.all(promises)
            .then(() => {
                setRiskFactorUpload([]); // Clear uploaded tasks
                setShowRiskFactorDataDefineTable(false); // Hide upload table after submission
            });
    };
    const handleSubmitService= () => {
        const promises = serviceUpload.map(item => {
            return projectServiceupload(item)
                .catch(() => {
                    console.log("uygwuet")
                });
        });

        Promise.all(promises)
            .then(() => {
                setServiceUpload([]); // Clear uploaded tasks
                setShowServiceDataDefineTable(false); // Hide upload table after submission
            });
    };
    const projectFormClear = () => {
        setFormData({
            projectNo: '', projectName: '', proStartDate: '', proActualDate: ''
        })
    }
    const stageFormClear = () => {
        setStageFormData({
            projectNo: '', projectName: '', stageStartDate: '', stageEndDate: '', stageStatus: ''
        })
    }
    const riskFactorFormClear = () => {
        setRiskFactoreFormDat({
            projectNo: '', projectName: '', riskFactor: '', riskStartDate: '', riskDate: '', riskStaus: ''
        })
    }
    const serviceFormClear = () => {
        setServiceFormData({
            projectNo: '', projectName: '', serviceFactor: '', serviceStatus: ''
        })
    }
 
    const getProjectData = () => {
        getProjectsDashboard()
            .then((response) => {
                console.log('getProjectDashboard', response.data);
                setGetProjectDetail(response.data || []);
            })
            .catch((error) => {
                console.log('Error GetProjectDashboard details:', error);
            });
        setShowProjectViewTable(true);
    }
    const getStageData = () => {
        getStageDashboard()
            .then((response) => {
                console.log('getProjectDashboard', response.data);
                setGetStageDetail(response.data || []);
            })
            .catch((error) => {
                console.log('Error GetProjectDashboard details:', error);
            });
        setShowStageViewTable(true);
    }
    const getRiskFactorData = () => {
        getRiskDashboard()
            .then((response) => {
                console.log('getProjectDashboard', response.data);
                setRiskFactorDetail(response.data || []);
            })
            .catch((error) => {
                console.log('Error GetProjectDashboard details:', error);
            });
        setShowRiskFactorViewTable(true);
    }
    const getServiceData = () => {
        getServiceDashboard()
            .then((response) => {
                console.log('getProjectDashboard', response.data);
                setGetServiceDetail(response.data || []);
            })
            .catch((error) => {
                console.log('Error GetProjectDashboard details:', error);
            });
        setShowServiceViewTable(true);
    }
    return (
        <div className='ProjectPage'>
            <div className="buttonshowing">
                <div className="ProjectPageName">
                    <p>Project</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button className="Projectbutton" onClick={showProjectDetail}>Project</button>
                    <button className="Projectbutton" onClick={showStageDetail}>Project Stage</button>
                    <button className="Projectbutton" onClick={showRiskFactorDetail}>Project RiskFactor</button>
                    <button className="Projectbutton" onClick={showServiceDetail}>Service Project</button>
                </div>
            </div>
            {showProject && (
                <div className="filed">
                    <div className="projectDownloadSheet">
                        <input type="file" accept=".xlsx, .xls" id="file-upload" onChange={(event) => prijectdatavalueset(event)} style={{ display: 'none' }} />        <label htmlFor="file-upload" className='uploadexcelButton'>
                            Upload File
                        </label>
                        <button className='Projectbutton' onClick={handleDownloadProject} >Download</button>
                    </div>
                    <div className="projectTextFiled">
                        <TextField
                            label="Project No"
                            name="projectNo"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={formData.projectNo || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.projectNo)}
                            helperText={formErrors.projectNo}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="Project Name"
                            name="projectName"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={formData.projectName || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.projectName)}
                            helperText={formErrors.projectName}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="proStartDate"
                            name="proStartDate"
                            type="date"
                            variant="standard"
                            fullWidth
                            value={formData.proStartDate || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.proStartDate)}
                            helperText={formErrors.proStartDate}
                            style={{ width: '207px' }}
                            InputLabelProps={{
                                shrink: true, // Ensures the label does not overlap with the input
                            }}
                            sx={{
                                '& input::-webkit-datetime-edit': {
                                    appearance: 'none',
                                },
                                '& input::-webkit-inner-spin-button': {
                                    display: 'none',
                                },
                            }}
                        />


                        <TextField
                            label="proActualDate"
                            name="proActualDate"
                            type="date"
                            variant="standard"
                            fullWidth
                            value={formData.proActualDate || ''}
                            onChange={handleChange}
                            error={Boolean(formErrors.proActualDate)}
                            helperText={formErrors.proActualDate}
                            style={{ width: '207px' }}
                            InputLabelProps={{
                                shrink: true, // Ensures the label does not overlap with the input
                            }}
                            sx={{
                                '& input::-webkit-datetime-edit': {
                                    appearance: 'none',
                                },
                                '& input::-webkit-inner-spin-button': {
                                    display: 'none',
                                },
                            }}
                        />
                    </div>
                    <div className="projectFiledButton">
                        <button className='Projectbutton' onClick={projectFormClear} >Clear</button>
                        <button className='Projectbutton' onClick={getProjectData}>View</button>
                        <button className='Projectbutton' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}


            {showStage && (

                <div className="filed">
                    <div className="projectDownloadSheet">
                        <input type="file" accept=".xlsx, .xls" id="file-upload" onChange={(event) => stagedatavalueset(event)} style={{ display: 'none' }} />        <label htmlFor="file-upload" className='uploadexcelButton'>
                            Upload File
                        </label>
                        <button className='Projectbutton' onClick={handleDownloadStage} >Download</button>
                    </div>
                    <div className="projectTextFiled">
                        <TextField
                            label="Project No"
                            name="projectNo"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={stageFormData.projectNo || ''}
                            onChange={stagehandleChange}
                            error={Boolean(formErrors.projectNo)}
                            helperText={formErrors.projectNo}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="Project Name"
                            name="projectName"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={stageFormData.projectName || ''}
                            onChange={stagehandleChange}
                            error={Boolean(formErrors.projectName)}
                            helperText={formErrors.projectName}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="stage"
                            name="stage"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={stageFormData.stage || ''}
                            onChange={stagehandleChange}
                            error={Boolean(formErrors.stage)}
                            helperText={formErrors.stage}
                            style={{ width: '207px' }}
                        />

                        <TextField
                            label="stageStartDate"
                            name="stageStartDate"
                            type="date"
                            variant="standard"
                            fullWidth
                            value={stageFormData.stageStartDate || ''}
                            onChange={stagehandleChange}
                            error={Boolean(formErrors.stageStartDate)}
                            helperText={formErrors.stageStartDate}
                            style={{ width: '207px' }}
                            InputLabelProps={{
                                shrink: true, // Ensures the label does not overlap with the input
                            }}
                            sx={{
                                '& input::-webkit-datetime-edit': {
                                    appearance: 'none',
                                },
                                '& input::-webkit-inner-spin-button': {
                                    display: 'none',
                                },
                            }}
                        />
                        <TextField
                            label="stageEndDate"
                            name="stageEndDate"
                            type="date"
                            variant="standard"
                            fullWidth
                            value={stageFormData.stageEndDate || ''}
                            onChange={stagehandleChange}
                            error={Boolean(formErrors.stageEndDate)}
                            helperText={formErrors.stageEndDate}
                            style={{ width: '207px' }}
                            InputLabelProps={{
                                shrink: true, // Ensures the label does not overlap with the input
                            }}
                            sx={{
                                '& input::-webkit-datetime-edit': {
                                    appearance: 'none',
                                },
                                '& input::-webkit-inner-spin-button': {
                                    display: 'none',
                                },
                            }}
                        />

                        <TextField
                            label="stageStatus"
                            name="stageStatus"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={stageFormData.stageStatus || ''}
                            onChange={stagehandleChange}
                            error={Boolean(formErrors.stageStatus)}
                            helperText={formErrors.stageStatus}
                            style={{ width: '207px' }}
                        />

                    </div>
                    <div className="projectFiledButton">
                        <button className='Projectbutton' onClick={stageFormClear} >Clear</button>
                        <button className='Projectbutton' onClick={getStageData}>View</button>
                        <button className='Projectbutton' onClick={handleStageSubmit}>Submit</button>
                    </div>
                </div>
            )}
            {showRiskFactor && (

                <div className="filed">
                    <div className="projectDownloadSheet">
                        <input type="file" accept=".xlsx, .xls" id="file-upload" onChange={(event) => riskFactordatavalueset(event)} style={{ display: 'none' }} />        <label htmlFor="file-upload" className='uploadexcelButton'>
                            Upload File
                        </label>
                        <button className='Projectbutton' onClick={handleDownloadRiskFactor} >Download</button>
                    </div>
                    <div className="projectTextFiled">
                        <TextField
                            label="Project No"
                            name="projectNo"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={riskFactoreFormData.projectNo || ''}
                            onChange={riskFactorhandleChange}
                            error={Boolean(formErrors.projectNo)}
                            helperText={formErrors.projectNo}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="Project Name"
                            name="projectName"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={riskFactoreFormData.projectName || ''}
                            onChange={riskFactorhandleChange}
                            error={Boolean(formErrors.projectName)}
                            helperText={formErrors.projectName}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="riskFactor"
                            name="riskFactor"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={riskFactoreFormData.riskFactor || ''}
                            onChange={riskFactorhandleChange}
                            error={Boolean(formErrors.riskFactor)}
                            helperText={formErrors.riskFactor}
                            style={{ width: '207px' }}
                        />

                        <TextField
                            label="riskStartDate"
                            name="riskStartDate"
                            type="date"
                            variant="standard"
                            fullWidth
                            value={riskFactoreFormData.riskStartDate || ''}
                            onChange={riskFactorhandleChange}
                            error={Boolean(formErrors.riskStartDate)}
                            helperText={formErrors.riskStartDate}
                            style={{ width: '207px' }}
                            InputLabelProps={{
                                shrink: true, // Ensures the label does not overlap with the input
                            }}
                            sx={{
                                '& input::-webkit-datetime-edit': {
                                    appearance: 'none',
                                },
                                '& input::-webkit-inner-spin-button': {
                                    display: 'none',
                                },
                            }}
                        />

                        <TextField
                            label="riskDate"
                            name="riskDate"
                            type="date"
                            variant="standard"
                            fullWidth
                            value={riskFactoreFormData.riskDate || ''}
                            onChange={riskFactorhandleChange}
                            error={Boolean(formErrors.riskDate)}
                            helperText={formErrors.riskDate}
                            style={{ width: '207px' }}
                            InputLabelProps={{
                                shrink: true, // Ensures the label does not overlap with the input
                            }}
                            sx={{
                                '& input::-webkit-datetime-edit': {
                                    appearance: 'none',
                                },
                                '& input::-webkit-inner-spin-button': {
                                    display: 'none',
                                },
                            }}
                        />
                        <TextField
                            label="riskStaus"
                            name="riskStaus"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={riskFactoreFormData.riskStaus || ''}
                            onChange={riskFactorhandleChange}
                            error={Boolean(formErrors.riskStaus)}
                            helperText={formErrors.riskStaus}
                            style={{ width: '207px' }}
                        />

                    </div>
                    <div className="projectFiledButton">
                        <button className='Projectbutton' onClick={riskFactorFormClear} >Clear</button>
                        <button className='Projectbutton' onClick={getRiskFactorData} >View</button>
                        <button className='Projectbutton' onClick={handleRiskFactorSubmit} >Submit</button>
                    </div>
                </div>
            )}
            {showService && (
                <div className="filed">
                    <div className="projectDownloadSheet">
                        <input type="file" accept=".xlsx, .xls" id="file-upload" onChange={(event) => servicedatavalueset(event)} style={{ display: 'none' }} />        <label htmlFor="file-upload" className='uploadexcelButton'>
                            Upload File
                        </label>
                        <button className='Projectbutton' onClick={handleDownloadService} >Download</button>
                    </div>
                    <div className="projectTextFiled">
                        <TextField
                            label="Project No"
                            name="projectNo"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={serviceFormData.projectNo || ''}
                            onChange={servicehandleChange}
                            error={Boolean(formErrors.projectNo)}
                            helperText={formErrors.projectNo}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="Project Name"
                            name="projectName"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={serviceFormData.projectName || ''}
                            onChange={servicehandleChange}
                            error={Boolean(formErrors.projectName)}
                            helperText={formErrors.projectName}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="serviceFactor"
                            name="serviceFactor"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={serviceFormData.serviceFactor || ''}
                            onChange={servicehandleChange}
                            error={Boolean(formErrors.serviceFactor)}
                            helperText={formErrors.serviceFactor}
                            style={{ width: '207px' }}
                        />
                        <TextField
                            label="serviceStatus"
                            name="serviceStatus"
                            type='text'
                            variant="standard"
                            fullWidth
                            value={serviceFormData.serviceStatus || ''}
                            onChange={servicehandleChange}
                            error={Boolean(formErrors.serviceStatus)}
                            helperText={formErrors.serviceStatus}
                            style={{ width: '207px' }}
                        />

                    </div>
                    <div className="projectFiledButton">
                        <button className='Projectbutton' onClick={serviceFormClear}>Clear</button>
                        <button className='Projectbutton' onClick={getServiceData} >View</button>
                        <button className='Projectbutton' onClick={handleServiceSubmit} >Submit</button>
                    </div>
                </div>
            )}

            <div className='ProjectTable'>
                <div className="projectTableContain">
                    {showprojectDataDefineTable && projectUpload.length > 0 && (
                        <TableContainer component={Paper}>
                            <button className='Taskbutton' onClick={handleSubmitProject}>Submit</button>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proStartDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proActualDate</TableCell>
                                        <TableCell>
                                            <CloseSharpIcon
                                                sx={{ color: "red", fontSize: 30 }}
                                                onClick={clocePopup}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projectUpload
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.projectNo}</TableCell>
                                                <TableCell>{row.proStartDate}</TableCell>
                                                <TableCell>{row.proActualDate}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={projectUpload.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}
                </div>
            </div>
            <div className='ProjectTable'>
                <div className="projectTableContain">
                    {showstageDataDefineTable && stageUpload.length > 0 && (
                        <TableContainer component={Paper}>
                            <button className='Taskbutton' onClick={handleSubmitStage}>Submit</button>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proStartDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proActualDate</TableCell>
                                        <TableCell>
                                            <CloseSharpIcon
                                                sx={{ color: "red", fontSize: 30 }}
                                                onClick={clocePopup}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stageUpload
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.projectNo}</TableCell>
                                                <TableCell>{row.proStartDate}</TableCell>
                                                <TableCell>{row.proActualDate}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={stageUpload.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}
                </div>
            </div>
            <div className='ProjectTable'>
                <div className="projectTableContain">
                    {showriskFactorDataDefineTable && riakFactorUpload.length > 0 && (
                        <TableContainer component={Paper}>
                            <button className='Taskbutton' onClick={handleSubmitRiskFactor}>Submit</button>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proStartDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proActualDate</TableCell>
                                        <TableCell>
                                            <CloseSharpIcon
                                                sx={{ color: "red", fontSize: 30 }}
                                                onClick={clocePopup}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {riakFactorUpload
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.projectNo}</TableCell>
                                                <TableCell>{row.proStartDate}</TableCell>
                                                <TableCell>{row.proActualDate}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={riakFactorUpload.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}
                </div>
            </div>
            <div className='ProjectTable'>
                <div className="projectTableContain">
                    {showserviceDataDefineTable && serviceUpload.length > 0 && (
                        <TableContainer component={Paper}>
                            <button className='Taskbutton' onClick={handleSubmitRiskFactor}>Submit</button>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proStartDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proActualDate</TableCell>
                                        <TableCell>
                                            <CloseSharpIcon
                                                sx={{ color: "red", fontSize: 30 }}
                                                onClick={clocePopup}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {serviceUpload
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.projectNo}</TableCell>
                                                <TableCell>{row.proStartDate}</TableCell>
                                                <TableCell>{row.proActualDate}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={serviceUpload.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}
                </div>
            </div>
            <div className='ProjectTable'>
                <div className="projectTableContain">
                    {showProjectViewTable  && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>projectName</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proStartDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>proActualDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>update</TableCell>
                                        <TableCell>
                                            <CloseSharpIcon
                                                sx={{ color: "red", fontSize: 30 }}
                                                onClick={clocePopup}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getProjectDetail
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.projectNo}</TableCell>
                                                <TableCell>{row.projectName}</TableCell>
                                                <TableCell>{row.proStartDate}</TableCell>
                                                <TableCell>{row.proActualDate}</TableCell>
                                                <TableCell> <FontAwesomeIcon icon={faPen}style={{ color: 'green',cursor:'pointer' }} /></TableCell>
                                                <TableCell> <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} /></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={getProjectDetail?.length || 0}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}

                </div>
            </div>
            <div className='ProjectTable'>
                <div className="projectTableContain">
                    {showstageViewTable  && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>projectName</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>stageStartDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>stageEndDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>stageStatus</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>update</TableCell>
                                        <TableCell>
                                            <CloseSharpIcon
                                                sx={{ color: "red", fontSize: 30 }}
                                                onClick={clocePopup}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getStageDetail
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.projectNo}</TableCell>
                                                <TableCell>{row.projectName}</TableCell>
                                                <TableCell>{row.stageStartDate}</TableCell>
                                                <TableCell>{row.stageEndDate}</TableCell>
                                                <TableCell>{row.stageStatus}</TableCell>
                                                <TableCell> <FontAwesomeIcon icon={faPen}style={{ color: 'green',cursor:'pointer' }} /></TableCell>
                                                <TableCell> <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} /></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={getStageDetail?.length || 0}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}

                </div>
            </div>
            <div className='ProjectTable'>
                <div className="projectTableContain">
                    {showriskFactorViewTable  && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>projectName</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>riskFactor</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>riskStartDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>riskDate</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>riskStaus</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>update</TableCell>
                                        <TableCell>
                                            <CloseSharpIcon
                                                sx={{ color: "red", fontSize: 30 }}
                                                onClick={clocePopup}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getRiskFactorDetail
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.projectNo}</TableCell>
                                                <TableCell>{row.projectName}</TableCell>
                                                <TableCell>{row.riskFactor}</TableCell>
                                                <TableCell>{row.riskStartDate}</TableCell>
                                                <TableCell>{row.riskDate}</TableCell>
                                                <TableCell>{row.riskStaus}</TableCell>
                                                <TableCell> <FontAwesomeIcon icon={faPen}style={{ color: 'green',cursor:'pointer' }} /></TableCell>
                                                <TableCell> <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} /></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={getRiskFactorDetail?.length || 0}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}

                </div>
            </div>
            <div className='ProjectTable'>
                <div className="projectTableContain">
                    {showserviceViewTable  && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>projectName</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>serviceFactor</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>serviceStatus</TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>update</TableCell>
                                        <TableCell>
                                            <CloseSharpIcon
                                                sx={{ color: "red", fontSize: 30 }}
                                                onClick={clocePopup}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getServiceDetail
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{row.projectNo}</TableCell>
                                                <TableCell>{row.projectName}</TableCell>
                                                <TableCell>{row.serviceFactor}</TableCell>
                                                <TableCell>{row.serviceStatus}</TableCell>
                                                <TableCell> <FontAwesomeIcon icon={faPen}style={{ color: 'green',cursor:'pointer' }} /></TableCell>
                                                <TableCell> <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} /></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={getServiceDetail?.length || 0}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProkjectSheet