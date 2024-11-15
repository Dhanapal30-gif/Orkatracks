import React,{useEffect, useState} from 'react'
import { ListOfEmp } from '../Services/Services'



    const EmpList = () => {
        const [employee, setEmployee] = useState([]);
    
        useEffect(() => {
            ListOfEmp().then((response) => {
                setEmployee(response.data);
            }).catch(error => {
                console.error(error);
            });
        }, []);
    
    
  return (
<div
        className='p-5 text-center bg-image'
        style={{ backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')", height: '700px' }}
      >
    <div className='container'>
        <h1>List of employee</h1>
        <table className="table table-hover">
        <thead>
        <tr>
            <th scope="row">Employee ID</th>
            <th scope="row">Employee Name</th>
            <th scope="row">Employee Email</th>
        </tr>
    </thead>
    <tbody>
        {
            employee.map(Emp => (
                <tr key={Emp.empId}>
                    <td>{Emp.empId}</td>
                    <td>{Emp.firstName}</td>
                    <td>{Emp.lastName}</td>
                    <td>{Emp.dateOfBirth}</td>
                    <td>{Emp.phoneNumber}</td>
                    <td>{Emp.email}</td>
                    <td>{Emp.password}</td>
                </tr>
            ))
        }
    </tbody>
        </table>
        
    </div>
    
    </div>
    
  )
}

export default EmpList