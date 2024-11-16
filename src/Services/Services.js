import axios from "axios";

const Reg_Api= 'http://localhost:8080/getAllData'

export const ListOfEmp=() =>axios.get(Reg_Api);

const Regemp_Api='http://localhost:8080/reg_Save'

export const saveEmpDetail= (formData)=>axios.post(Regemp_Api,formData);
 

const Login_Api='http://localhost:8080/login'

export const loginEmp = (formData) => axios.post(Login_Api, formData );

const Chnage_Api='http://localhost:8080/changePassword'

export const ChangePr= (formData) => axios.put(Chnage_Api, formData );

//const sendTask_Api='http://localhost:8080/save_Task'
const sendTask_Api='http://localhost:8080/save_Task'
export const sendTask=(formData)=>axios.post(sendTask_Api,formData);

// const empId = sessionStorage.getItem('empId');
// const getTask_Api='http://localhost:8080/getTask/${empId}'
// export const getTask=()=>axios.get(getTask_Api);
    const empId = sessionStorage.getItem('empId');
    const getTask_Api = `https://backend-4-w2iw.onrender.com/${empId}`;
    export const getTask = () => axios.get(getTask_Api);

    //const update_Api='http://localhost:8080/Update'
    const update_Api='http://localhost:8080/Update'
    export const updateTask=(formData)=>axios.put(update_Api,[formData]);

    const Leave_Api='http://localhost:8080/leave'
    export const leave=(formData)=>axios.post(Leave_Api,[formData]);

    const Project_Management='http://localhost:8080/saveProject'
    export const projectmanagement=(formData)=>axios.post(Project_Management,[formData]);

    const getProject_Api = `http://localhost:8080/api/getProject`;
    export const getProjectMangement = () => axios.get(getProject_Api);

    const updateProject_Api='http://localhost:8080/update'
    export const updateProject=(formData)=>axios.put(updateProject_Api,[formData]);

    const Task_Managent='http://localhost:8080/api/saveTaskManagement'
    export const taskManagement=(formData)=>axios.post(Task_Managent,[formData]);

    const updateLeave_Api='http://localhost:8080/api/leaveController/updateLeave'
    export const updateLeave=(formData)=>axios.put(updateLeave_Api,[formData]);

    const getLeaveApi = `http://localhost:8080/getLeave/${empId}`;
    export const getLevae = () => axios.get(getLeaveApi);

    const setHolidy_Api = `http://localhost:8080/api/leaveManage/saveHoliday`;
    export const setHoliday = (updateData) => axios.post(setHolidy_Api, updateData);

    const getWeeklyPerormance_Api = `http://localhost:8080/api/PerController/getWeekly/${empId}`;
    export const getWeekly = () => axios.get(getWeeklyPerormance_Api);
    
    const getMonthlyPerormance_Api = `http://localhost:8080/api/PerController/getMonthly/${empId}`;
    export const getMonthly = () => axios.get(getMonthlyPerormance_Api);
    
    const getHolday_Api = `http://localhost:8080/api/getHoliday`;
    export const getHoliday = () => axios.get(getHolday_Api);