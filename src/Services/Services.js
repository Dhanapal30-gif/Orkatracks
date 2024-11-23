import axios from "axios";
import { url } from '../appConfig';

const Reg_Api= `${url}/getAllData`
export const ListOfEmp=() =>axios.get(Reg_Api);

const Regemp_Api=`${url}/reg_Save`
export const saveEmpDetail= (formData)=>axios.post(Regemp_Api,formData);
 

const Login_Api=`${url}/login`
export const loginEmp = (formData) => axios.post(Login_Api, formData );

const Chnage_Api=`${url}/changePassword`
export const ChangePr= (formData) => axios.put(Chnage_Api, formData );

const sendTask_Api=`${url}/save_Task`
export const sendTask=(formData)=>axios.post(sendTask_Api,formData);


    const empId = sessionStorage.getItem('empId');

    const getTask_Api = `${url}/getTask/${empId}`;
    export const getTask = () => axios.get(getTask_Api);

    const update_Api=`${url}/Update`
    export const updateTask=(formData)=>axios.put(update_Api,[formData]);

    const Leave_Api=`${url}/leave`
    export const leave=(formData)=>axios.post(Leave_Api,[formData]);

    const Project_Management=`${url}/saveProject`
    export const projectmanagement=(formData)=>axios.post(Project_Management,[formData]);

    const getProject_Api = `${url}/api/getProject`;
    export const getProjectMangement = () => axios.get(getProject_Api);

    const updateProject_Api=`${url}/update`
    export const updateProject=(formData)=>axios.put(updateProject_Api,[formData]);

    const Task_Managent=`${url}/api/saveTaskManagement`
    export const taskManagement=(formData)=>axios.post(Task_Managent,[formData]);

    const updateLeave_Api=`${url}/api/leaveController/updateLeave`
    export const updateLeave=(formData)=>axios.put(updateLeave_Api,[formData]);

    const getLeaveApi = `${url}/getLeave/${empId}`;
    export const getLevae = () => axios.get(getLeaveApi);

    const setHolidy_Api = `${url}/api/leaveManage/saveHoliday`;
    export const setHoliday = (updateData) => axios.post(setHolidy_Api, updateData);

    const getWeeklyPerormance_Api = `${url}/api/PerController/getWeekly/${empId}`;
    export const getWeekly = () => axios.get(getWeeklyPerormance_Api);
    
    const getMonthlyPerormance_Api = `${url}/api/PerController/getMonthly/${empId}`;
    export const getMonthly = () => axios.get(getMonthlyPerormance_Api);
    
    const getHolday_Api = `${url}/api/getHoliday`;
    export const getHoliday = () => axios.get(getHolday_Api);

    
    const getEmploye_Api = `${url}/api/authContoller/getEmployeeDetail`;
    export const getAllEmployeDeatil = () => axios.get(getEmploye_Api);

    const getTaskDetail_Api = `${url}/api/taskContoller/getAllTask`;
    export const getTaskDeatil = (formData) => {
      return axios.get(`${getTaskDetail_Api}?empId=${formData.empId}`);
    };
    
    const getWeekelyPerformance_Api = `${url}/api/performance/getWeeklyPerformance`;
    export const getWeeklyAllPerformance= (formData) => {
      return axios.get(`${getWeekelyPerformance_Api}?empId=${formData.empId}`);
    };

    const getMonthlyPerformance_Api = `${url}/api/performance/getMonthlyPerformance`;
    export const getMonthlyAllPerformance= (formData) => {
     return axios.get(`${getMonthlyPerformance_Api}?empId=${formData.empId}`);
    };

    
    const getAllProject_Api = `${url}/api/projectController/getProjectDetail`;
    export const getAllProjectDeatil = () => axios.get(getAllProject_Api);
    

    const getAllProjectDetail_Api = `${url}/api/MasterContoller/getProject`;
    export const getProjectBy= (getProject) => {
     return axios.get(`${getAllProjectDetail_Api}?projectNo=${getProject.projectNo}`);
    };

    const Account_Management=`${url}/api/accountsController/accountManagement`
    export const AccountMangement=(formData)=>axios.post(Account_Management,[formData]);
    
    const getAccount_Api = `${url}/api/Account/getallAccountdeatil`;
    export const getAccountDeatil = () => axios.get(getAccount_Api);
    