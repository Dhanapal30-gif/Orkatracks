import React, { useState, useEffect } from 'react';
import { TextField, IconButton, InputAdornment, Button, Snackbar, Alert, Typography, Box, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { loginEmp } from '../Services/Services';
import './Login.css';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupSeverity, setPopupSeverity] = useState('success');
    const [formData, setFormData] = useState({ empId: '', password: '' });
    const [formErrors, setFormErrors] = useState({ empId: '', password: '' });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        let isValid = true;
        const errors = {};
        if (!formData.empId) {
            errors.empId = 'Employee ID is required';
            isValid = false;
        }
        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            loginEmp(formData)
                .then((response) => {
                    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                    const empId = data.empId;
                    const empName = data.empName;
                    const userRole = data.userRole;
                    sessionStorage.setItem('empId', empId);
                    sessionStorage.setItem('empName', empName);
                    sessionStorage.setItem('userRole',userRole);
                    console.log("userRole",userRole)
                    setPopupMessage(`Login successful! Employee ID: ${empId}`);
                    setPopupSeverity('success');
                    setOpen(true);
                    setTimeout(() => {
                        navigate('/Home');
                    }, 1000);
                })
                .catch((error) => {
                    console.error('Error:', error); 
                    if (error.response && error.response.data) {
                        alert(error.response.data.message || 'Employee ID or  password is wrong');
                    } else {
                        alert('Something went wrong. Please try again later.');
                    }
                });
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <div
            className="bg-image"
            style={{
                backgroundImage: "url('https://mdbootstrap.com/img/Photos/Others/images/76.jpg')",
                height: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: '30px',
                    maxWidth: '400px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px'
                }}
            >
                <Typography variant="h4" gutterBottom>
                    OrkaTrack
                </Typography>
                <Typography  gutterBottom>
                    Please Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Employee ID"
                        variant="outlined"
                        fullWidth
                        name="empId"
                        value={formData.empId}
                        onChange={handleChange}
                        error={Boolean(formErrors.empId)}
                        helperText={formErrors.empId}
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={Boolean(formErrors.password)}
                        helperText={formErrors.password}
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ marginTop: '20px' }}
                    >
                        Login
                    </Button>
                    <Box mt={2}>
                        <Button color="success" component={Link} to='/CreateAccount' sx={{ textTransform: 'none' }}>
                        CreateAccount
                        </Button>
                        <Button color="success" component={Link} to='/ChangePassword' sx={{ textTransform: 'none', ml: 2 }}>
                            Change Password
                        </Button>
                    </Box>
                </form>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity={popupSeverity} sx={{ width: '100%' }}>
                        {popupMessage}
                    </Alert>
                </Snackbar>
            </Paper>
        </div>
    );
}