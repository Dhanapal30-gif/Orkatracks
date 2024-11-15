import logo from './logo.svg';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CreateAccount from  './CreateAccount/CreateAccount';
import ChangePassword from './ChangePassword/ChangePassword';
import Home from './Home/Home';
import LoginPage from './Login/Login';
import Header from './Component/HeaderComponent';
import {  Route, Routes, useLocation } from 'react-router-dom';
import EmpList from './Component/EmpList';
import WriteTask from './Task/writeTask';
import Task from './Task/Task';
import Leave from './Leave/Leave';
import Approve from './Leave/Approve'
import LeaveManagement from './Master/LeaveManagement';
import ProjectMangement from './Master/ProjectMangement';
import TaskManagement from './Master/TaskManagement';
import Projects from './Projects/Projects';
import Performance from './Performance/Performance'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/CreateAccount';
  console.log("isLoginPage", isLoginPage);
  
  const theme = createTheme({
    typography: {
      allVariants: {
        fontStyle: 'normal',
        fontFamily:'default',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {!isLoginPage && <Header />}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path='/CreateAccount' element={<CreateAccount />} />
          <Route path='/ChangePassword' element={<ChangePassword />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/EmpList' element={<EmpList />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/WriteTask' element={<WriteTask />} />
          <Route path='/Task' element={<Task />} />
          <Route path='/Leave' element={<Leave />} />
          <Route path='/Approve' element={<Approve />} />
          <Route path='/LeaveManagement' element={<LeaveManagement />} />
          <Route path='/ProjectManagement' element={<ProjectMangement />} /> 
          <Route path='/TaskManagement' element={<TaskManagement />} /> 
          <Route path='/Projects' element={<Projects />} /> 
          <Route path='/Performance' element={<Performance/>} /> 

        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;