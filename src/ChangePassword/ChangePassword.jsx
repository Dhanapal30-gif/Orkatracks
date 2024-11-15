import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { ChangePr } from '../Services/Services';

const ChangePassword = () => {

    const[showPassword,setShowPassword]=useState(false);
    const navigate=useNavigate('');

    
    const handleClickShowPassword = ()=>{
        setShowPassword(!showPassword);
    };

    const[formData,setFormData] = useState({
        empId:'',
        oldPassword:'',
        newPassword:'',
    });

    const[formErrors,setFormErrors] = useState({
        empId:'',
        oldPassword:'',
        newPassword:'',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`${name}: ${value}`); // Debugging line
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const validate = () => {
        let isValid = true;
        const errors = {};
        if (!formData.empId) {
            errors.empId = 'Employee ID is required';
            isValid = false;
        }
        if (!formData.newPassword) {
            errors.newPassword = 'newPassword is required';
            isValid = false;
        }
        if (!formData.oldPassword) {
            errors.oldPassword = 'oldPassword is required';
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        if (validate()) {
          console.log('Form data:', formData); // Ensure the form is validated before submitting
          ChangePr(formData) // Call API with form data
            .then((response) => {
                console.log('Form data:', formData); // Log the form data for debugging
                navigate('/Login'); // Redirect to login page on success
            });
        }
      };

      
  return (
    <div className='contain1'>
    <h2>Signin</h2>
    <form onSubmit={handleSubmit}>
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
    label="Old Password"
    variant="outlined"
    fullWidth
    name="oldPassword"
    type={showPassword ? 'text' : 'password'}  // Correct type here
    value={formData.oldPassword}  // Use oldPassword state
    onChange={handleChange}
    error={Boolean(formErrors?.oldPassword)}
    helperText={formErrors.oldPassword}
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
<TextField
    label="New Password"
    variant="outlined"
    fullWidth
    name="newPassword"
    type={showPassword ? 'text' : 'password'}  // Correct type here
    value={formData.newPassword}  // Use newPassword state
    onChange={handleChange}
    error={Boolean(formErrors?.newPassword)}
    helperText={formErrors.newPassword}
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
        <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            style={{ marginTop: '20px' }}
        >
            Login 
        </Button>
        <Button color="inherit" component={Link} to='/CreateAccount'>
            Register
        </Button>
        
    </form>
</div>
  )
}

export default ChangePassword