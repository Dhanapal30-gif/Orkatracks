import axios from "axios";

const Reg_Api= 'https://backend-4-w2iw.onrender.com/getAllData'

export const ListOfEmp=() =>axios.get(Reg_Api);

const Regemp_Api='https://backend-4-w2iw.onrender.com/reg_Save'

export const saveEmpDetail= (formData)=>axios.post(Regemp_Api,formData);
 

const Login_Api='https://backend-4-w2iw.onrender.com/login'

export const loginEmp = (formData) => axios.post(Login_Api, formData );

const Chnage_Api='https://backend-4-w2iw.onrender.com/changePassword'

export const ChangePr= (formData) => axios.put(Chnage_Api, formData );

//const sendTask_Api='http://localhost:8080/save_Task'
const sendTask_Api='https://backend-4-w2iw.onrender.com/save_Task'
export const sendTask=(formData)=>axios.post(sendTask_Api,formData);

// const empId = sessionStorage.getItem('empId');
// const getTask_Api='http://localhost:8080/getTask/${empId}'
// export const getTask=()=>axios.get(getTask_Api);/getTask/{empId}
    const empId = sessionStorage.getItem('empId');
    const getTask_Api = `https://backend-4-w2iw.onrender.com/getTask/${empId}`;
    export const getTask = () => axios.get(getTask_Api);

    //const update_Api='http://localhost:8080/Update'
    const update_Api='https://backend-4-w2iw.onrender.com/Update' 
    export const  updateTask=(formData)=>axios.put(update_Api,[formData]);

    const Leave_Api='https://backend-4-w2iw.onrender.com/leave'
    export const leave=(formData)=>axios.post(Leave_Api,[formData]);

    const Project_Management='https://backend-4-w2iw.onrender.com/saveProject'
    export const projectmanagement=(formData)=>axios.post(Project_Management,[formData]);

    const getProject_Api = `https://backend-4-w2iw.onrender.com/api/getProject`;
    export const getProjectMangement = () => axios.get(getProject_Api);

    const updateProject_Api='https://backend-4-w2iw.onrender.com/update'
    export const updateProject=(formData)=>axios.put(updateProject_Api,[formData]);

    const Task_Managent='https://backend-4-w2iw.onrender.com/api/saveTaskManagement'
    export const taskManagement=(formData)=>axios.post(Task_Managent,[formData]);

    const updateLeave_Api='https://backend-4-w2iw.onrender.com/api/leaveController/updateLeave'
    export const updateLeave=(formData)=>axios.put(updateLeave_Api,[formData]);

    const getLeaveApi = `https://backend-4-w2iw.onrender.com/getLeave/${empId}`;
    export const getLevae = () => axios.get(getLeaveApi);

    const setHolidy_Api = `https://backend-4-w2iw.onrender.com/api/leaveManage/saveHoliday`;
    export const setHoliday = (updateData) => axios.post(setHolidy_Api, updateData);

    const getWeeklyPerormance_Api = `https://backend-4-w2iw.onrender.com/api/PerController/getWeekly/${empId}`;
    export const getWeekly = () => axios.get(getWeeklyPerormance_Api);
    
    const getMonthlyPerormance_Api = `https://backend-4-w2iw.onrender.com/api/PerController/getMonthly/${empId}`;
    export const getMonthly = () => axios.get(getMonthlyPerormance_Api);
    
    const getHolday_Api = `https://backend-4-w2iw.onrender.com/api/getHoliday`;
    export const getHoliday = () => axios.get(getHolday_Api);