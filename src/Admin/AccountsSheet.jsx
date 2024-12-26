import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, LinearProgress, colors, } from "@mui/material";
import './AccountsSheet.css'
import { AccountMangement, deletedatad, getAccountDeatil } from '../Services/Services';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { faPen } from '@fortawesome/free-solid-svg-icons';
const AccountsSheet = () => {
  const [formErrors, setFormErrors] = useState({ projectNo: '' });
  const [formData, setFormData] = useState({ projectNo: '', projectName: '', catagery: '', po_Amount: '', date: '', credit_Amount: '',planedBudjet:'', debit_Amount: '', bankBalance: '', emi: '', outstandingAmount: '' });
  const [showUploadTable, setShowUploadTable] = useState(false);
  const [uploadedTasks, setUploadedTasks] = useState([]);
  //const rowsPerPage = 7;
  const [getAllAccountDetail, setGetAllAccountDetail] = useState([]);
  const [showAccountTable, setShowAccountTable] = useState(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (!formData.catagery) {
      errors.catagery = "Please fill catagery";
      isValid = false;
    }
    if (!formData.po_Amount) {
      errors.po_Amount = "Please fill po_Amount";
      isValid = false;
    }
    if (!formData.date) {
      errors.date = "Please fill date";
      isValid = false;
    }
    if (!formData.credit_Amount) {
      errors.credit_Amount = "Please fill credit_Amount";
      isValid = false;
    }
    if (!formData.debit_Amount) {
      errors.debit_Amount = "Please fill debit_Amount";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  }
  const clocePopup = () => {
    setShowUploadTable(false)
    setShowAccountTable(false)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  useEffect(() => {
    if (uploadedTasks.length > 0) {
      setShowUploadTable(true); // Ensure the table visibility updates when tasks are added
    }
  }, [uploadedTasks]);


  const formClear = () => {
    setFormData({
      projectNo: '', projectName: '', catagery: '', po_Amount: '', date: '', credit_Amount: '', debit_Amount: '', bankBalance: '', emi: '', outstandingAmount: ''
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Optimistic feedback (clear form immediately)
      setFormData({
        projectNo: '', projectName: '', category: '', po_Amount: '', date: '',
        credit_Amount: '', debit_Amount: '', bankBalance: '', emi: '', outstandingAmount: ''
      });

      // Submit to backend
      await AccountMangement(formData);

      console.log("Submission successful!");
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };
  const handleDownloadAccount = () => {
    // Format the date as 'dd-mm-yyyy'
    const formattedDate = new Date(2024, 6, 7); // Months are 0-indexed in JavaScript, so 6 is July
    const dateString = `${("0" + formattedDate.getDate()).slice(-2)}-${("0" + (formattedDate.getMonth() + 1)).slice(-2)}-${formattedDate.getFullYear()}`;

    const templateData = [
      {
        projectNo: '',
        projectName: '',
        catagery: '',
        po_Amount: '',
        debit_Amount: '',
        credit_Amount: '',
        date: dateString,
        planedBudjet: '',
        emi: '',
        outstandingAmount: '',
        bankBalance: '',
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TaskTemplate');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'AccountsSheet.xlsx');
  };
  useEffect(() => {
    if (uploadedTasks.length > 0) {
      setShowUploadTable(true); // Ensure the table visibility updates when tasks are added
    }
  }, [uploadedTasks]);
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

        setUploadedTasks(formattedData);
        setShowUploadTable(true);

        // Reset the file input
        event.target.value = '';
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const clearTable = () => {
    setUploadedTasks([]);
    setShowUploadTable(false);
  };
  const handleSubmitUploadedTasks = () => {
    const promises = uploadedTasks.map(item => {
      return AccountMangement(item)
        .catch(() => {
          console.log("uygwuet")
        });
    });

    Promise.all(promises)
      .then(() => {
        setUploadedTasks([]); // Clear uploaded tasks
        setShowUploadTable(false); // Hide upload table after submission
      });
  };
  const getAccount = () => {
    getAccountDeatil()
      .then((response) => {
        console.log("iygwegy", response.data)
        setGetAllAccountDetail(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.log("uyge86y");
      });
    setShowAccountTable(true)
  }
  const filteredData = getAllAccountDetail.filter((item) => {
    const projectNo = item.projectNo || "";
    const projectName = item.projectName || "";
    const catagery = item.catagery || "";
    const date = item.date || "";
    const poAmount = item.po_Amount?.toString() || "";
    const debitAmount = item.debit_Amount?.toString() || "";

    return (
      projectNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catagery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      date.includes(searchTerm) ||
      poAmount.includes(searchTerm) ||
      debitAmount.includes(searchTerm)
    );
  });

const handleDelete =()=>{
  deletedatad()
        .then((response)=>{
          alert("Deleted sucessfully")
        })
      closeDialog();
      setShowAccountTable(false);
      getAccountDeatil()
    }
      const formattedDate = new Date(2024, 6, 7); // Months are 0-indexed in JavaScript, so 6 is July
    const dateString = `${("0" + formattedDate.getDate()).slice(-2)}-${("0" + (formattedDate.getMonth() + 1)).slice(-2)}-${formattedDate.getFullYear()}`;

    
    
    
  return (
    <div className='AccountsPage'>
      <div className="accountsUploa">
        <div className="downloadSheet">
          <input type="file" accept=".xlsx, .xls" id="file-upload" onChange={handleFileUpload} style={{ display: 'none' }} />        <label htmlFor="file-upload" className='uploadexcelButton'>
            Upload File
          </label>
          <button className='Taskbutton' onClick={handleDownloadAccount}>Download</button>

        </div>
        <div className="textFiled">
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
            label="catagery"
            name="catagery"
            type='text'
            variant="standard"
            fullWidth
            value={formData.catagery || ''}
            onChange={handleChange}
            error={Boolean(formErrors.catagery)}
            helperText={formErrors.catagery}
            style={{ width: '207px' }}
          />
          <TextField
            label="po_Amount"
            name="po_Amount"
            type='text'
            variant="standard"
            fullWidth
            value={formData.po_Amount || ''}
            onChange={handleChange}
            error={Boolean(formErrors.po_Amount)}
            helperText={formErrors.po_Amount}
            style={{ width: '207px' }}
          />
          <TextField
            label=""
            name="date"
            type="date"
            variant="standard"
            fullWidth
            value={formData.date }
            onChange={handleChange}
            error={Boolean(formErrors.date)}
            helperText={formErrors.date}
            style={{ width: '207px' }}
          />
          <TextField
            label="credit_Amount"
            name="credit_Amount"
            type='text'
            variant="standard"
            fullWidth
            value={formData.credit_Amount || ''}
            onChange={handleChange}
            error={Boolean(formErrors.credit_Amount)}
            helperText={formErrors.credit_Amount}
            style={{ width: '207px' }}
          />
          <TextField
            label="planedBudjet"
            name="planedBudjet"
            type='text'
            variant="standard"
            fullWidth
            value={formData.planedBudjet || ''}
            onChange={handleChange}
            error={Boolean(formErrors.planedBudjet)}
            helperText={formErrors.planedBudjet}
            style={{ width: '207px' }}
          />
          <TextField
            label="debit_Amount"
            name="debit_Amount"
            type='text'
            variant="standard"
            fullWidth
            value={formData.debit_Amount || ''}
            onChange={handleChange}
            error={Boolean(formErrors.debit_Amount)}
            helperText={formErrors.debit_Amount}
            style={{ width: '207px' }}
          />
          <TextField
            label="bankBalance"
            name="bankBalance"
            type='text'
            variant="standard"
            fullWidth
            value={formData.bankBalance || ''}
            onChange={handleChange}
            error={Boolean(formErrors.bankBalance)}
            helperText={formErrors.bankBalance}
            style={{ width: '207px' }}
          />
          <TextField
            label="emi"
            name="emi"
            type='text'
            variant="standard"
            fullWidth
            value={formData.emi || ''}
            onChange={handleChange}
            error={Boolean(formErrors.emi)}
            helperText={formErrors.emi}
            style={{ width: '207px' }}
          />
          <TextField
            label="outstandingAmount"
            name="outstandingAmount"
            type='text'
            variant="standard"
            fullWidth
            value={formData.outstandingAmount || ''}
            onChange={handleChange}
            error={Boolean(formErrors.outstandingAmount)}
            helperText={formErrors.outstandingAmount}
            style={{ width: '207px' }}
          />

        </div>
        <div className="filedButton">
          <button className='Taskbutton' onClick={formClear}>Clear</button>
          <button className='Taskbutton' onClick={getAccount}>View</button>
          <button className='Taskbutton' onClick={handleSubmit}>Submit</button>

        </div>
      </div>
      <div className='AccountTable'>
        <div className="tableContain">
          {showUploadTable && uploadedTasks.length > 0 && (
            <TableContainer component={Paper}>
              <button className='Taskbutton' onClick={handleSubmitUploadedTasks}>Submit</button>
              <Table>
                <TableHead style={{ backgroundColor: "#4A148C" }}>
                  <TableRow>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Project Name</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>PO Amount</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Debit Amount</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Credit Amount</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Planned Budget</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>EMI</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Outstanding Amount</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Bank Balance</TableCell>
                    <TableCell>
                      <CloseSharpIcon
                        sx={{ color: "red", fontSize: 30 }}
                        onClick={clocePopup}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploadedTasks
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{row.projectNo}</TableCell>
                        <TableCell>{row.projectName}</TableCell>
                        <TableCell>{row.catagery}</TableCell>
                        <TableCell>{row.po_Amount}</TableCell>
                        <TableCell>{row.debit_Amount}</TableCell>
                        <TableCell>{row.credit_Amount}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.planedBudjet}</TableCell>
                        <TableCell>{row.emi}</TableCell>
                        <TableCell>{row.outstandingAmount}</TableCell>
                        <TableCell>{row.bankBalance}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={uploadedTasks.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}

              />

            </TableContainer>
          )}
        </div>

        <div className="tableContain">

          {showAccountTable && getAllAccountDetail.length > 0 && (

            <TableContainer component={Paper}>
              <div className="filterAccount">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
            <button  onClick={openDialog} className='Taskbutton'>Delete</button>
              </div>

              <Table>
                <TableHead style={{ backgroundColor: "#4A148C" }}>
                  <TableRow>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Project No</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Project Name</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>PO Amount</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Debit Amount</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Credit Amount</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Planned Budget</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>EMI</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Outstanding Amount</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Bank Balance</TableCell>
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
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{row.projectNo}</TableCell>
                        <TableCell>{row.projectName}</TableCell>
                        <TableCell>{row.catagery}</TableCell>
                        <TableCell>{row.po_Amount}</TableCell>
                        <TableCell>{row.debit_Amount}</TableCell>
                        <TableCell>{row.credit_Amount}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.planedBudjet}</TableCell>
                        <TableCell>{row.emi}</TableCell>
                        <TableCell>{row.outstandingAmount}</TableCell>
                        <TableCell>{row.bankBalance}</TableCell>
                        <TableCell> <FontAwesomeIcon icon={faPen}style={{ color: 'green',cursor:'pointer' }} /></TableCell>
                        <TableCell> <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={getAllAccountDetail.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />

            </TableContainer>
            
          )}
        </div>
      </div>
      <div>

      {isOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <p>Are you sure delete?</p>
            <div className="button-container">
              <button className="cancel-button" onClick={closeDialog}>
                Cancel
              </button>
              <button className="ok-button" onClick={handleDelete}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default AccountsSheet