import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { saveEmpDetail } from '../Services/Services';
import './CreateAccount.css';

export default function CreateAccount() {
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        empId: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validate = () => {
        const errors = {};
        let isValid = true;

        if (!formData.empId) {
            errors.empId = "Employee ID is required";
            isValid = false;
        }
        if (!formData.firstName) {
            errors.firstName = "First Name is required";
            isValid = false;
        }
        if (!formData.lastName) {
            errors.lastName = "Last Name is required";
            isValid = false;
        }
        if (!formData.dateOfBirth) {
            errors.dateOfBirth = "Date of Birth is required";
            isValid = false;
        }
        if (!formData.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email address is invalid';
            isValid = false;
        }
        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        }
        if (!formData.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const submissionData = {
                ...formData,
                empId: parseInt(formData.empId, 10) // Ensure empId is a number
            };
            saveEmpDetail(submissionData)
                .then(() => {
                    navigate('/login'); // Redirect to login page on success
                })
                .catch((error) => {
                    console.error("Error saving details:", error);
                });
        }
    };

    return (
        <div className='form-container'>
            <h4>Create Account</h4>
            <p>Stay Upload your Detail</p>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <TextField
                        label="Employee ID"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="empId"
                        value={formData.empId}
                        onChange={handleChange}
                        error={Boolean(formErrors.empId)}
                        helperText={formErrors.empId}
                        margin="normal"
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={Boolean(formErrors.firstName)}
                        helperText={formErrors.firstName}
                        margin="normal"
                    />
                </div>
                <div className="form-row">
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={Boolean(formErrors.lastName)}
                        helperText={formErrors.lastName}
                        margin="normal"
                    />
                    <TextField
                        label="Date of Birth"
                        variant="outlined"
                        fullWidth
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        error={Boolean(formErrors.dateOfBirth)}
                        helperText={formErrors.dateOfBirth}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <div className="form-row">
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(formErrors.email)}
                        helperText={formErrors.email}
                        margin="normal"
                    />
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={Boolean(formErrors.phoneNumber)}
                        helperText={formErrors.phoneNumber}
                        margin="normal"
                        inputProps={{
                            maxLength: 10,
                        }}
                    />
                </div>
                <div className="form-row">
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
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    Register
                </Button>
                <Button
                    color='inherit'
                    component={Link}
                    to='/login'
                >
                    Login
                </Button>
                <Button
                    color='inherit'
                    component={Link}
                    to='/empList'
                >
                    Employee List
                </Button>
            </form>
        </div>
    );
}
