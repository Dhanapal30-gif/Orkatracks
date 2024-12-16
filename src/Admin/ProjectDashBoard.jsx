import React, { useEffect, useState } from 'react';
import './ProjectDashBoardn.css';
import { getAccountDeatil, getProjectsDashboard, getRiskDashboard, getServiceDashboard, getStageDashboard } from '../Services/Services';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, LinearProgress, colors, } from "@mui/material";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Gauge } from '@mui/x-charts/Gauge';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const ProjectDashBoard = () => {
  const [projectDetail, setProjectDetail] = useState([]);
  const [projectStage, setProjectStage] = useState([]);
  const [projectRiskFactor, setProjectRiskFactor] = useState([]);
  const [projectService, setProjectService] = useState([]);
  const [accountDeatil, SetAccountDeatil] = useState([]);
  const [projectPercentages, setProjectPercentages] = useState([]);
  const [projectRiskFactorCount, setProjectRiskFactorCount] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState([]);
  const [projectPercenatgeVisible,setProjectPercenatgeVisible]=useState(false);
  const [projectdatechartData, setProjectdatechartData] = useState(null);
  const [projectexpance, setProjectexpances] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null); // Holds the selected project details
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [isProjectStageVisible, setProjectStageVisible] = useState();
  const [isProjectRiskFactorVisible, setProjectRiskFactorVisible] = useState(false);
  const [selectedRiskFactorDetails, setSelectedRiskFactorDetails] = useState(); // Holds the selected project details
  const [projectServiceData, setprojectServiceData] = useState([]);
  const [selectedProjectBudjectDetails, setSelectedProjectBudjectDetails] = useState(null); // Holds the selected project details
  const [isProjectPlanedBudjectVisible, setProjectPlanedBudjectVisible] = useState(false);
  const [serviceDaPercentages, setServiceDaPercentages] = useState([]);
  const [overallServicePercentage, setOverallServicePercentage] = useState([]);
  const [projectDasshboardVisible,setProjectDasshboardVisible]=useState(true);
  const [riskFactorDasshboardVisible,setRiskFactorDasshboardVisible]=useState(true);
  const [plannedBudjectDasshboardVisible,setPlannedBudjectDasshboardVisible]=useState(true);
  const [projectDateDasshboardVisible,setProjectDateDasshboardVisible]=useState(true);
  const [activeLink, setActiveLink] = useState("Live"); // Default active link is 'Live'
  const [selectedServiceProjectDetails, setSelectedServiceProjectDetails] = useState(null); // Holds the selected project details
  const [islectedServiceProjectVisible, setSelectedServiceProjectVisible] = useState(); // Holds the selected project details

  const clocePopup = () => {
    setSelectedServiceProjectVisible(false);
    setProjectStageVisible(false);
    setProjectRiskFactorVisible(false);
    setProjectPlanedBudjectVisible(false)
  }
  
  const togglePopup = () => {
    setProjectStageVisible(!isProjectStageVisible);

  };
  const toggleRiskFactorPopup = () => {
    setProjectRiskFactorVisible(!isProjectRiskFactorVisible);
  };
  const toggleBudjectPopup = () => {
    setProjectPlanedBudjectVisible(!isProjectPlanedBudjectVisible);
  };
  const toggleServicePopup = () => {
    setSelectedServiceProjectVisible(!islectedServiceProjectVisible);
  };
  //--------------------------
  const data = [
    { label: "Percentage", value: overallPercentage },
  ];

  const sizing = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    legend: { hidden: true },
  };
  const TOTAL = 100; // Fixed total value for percentage

  const getColorBasedOnPercentage = (value) => {
    if (value <= 50) return "#FF4C4C"; // Red for 0-50%
    return "#4CAF50"; // Green for 51-100%
  };

  const getArcLabel = (params) => {
    const percent = (params.value / TOTAL) * 100;
    return `${percent.toFixed(0)}%`; // Display percentage
  };
  const percentageValue = data[0].value; // Assuming single value for simplicity

  //------------------
  useEffect(() => {
    Promise.all([
      getProjectsDashboard(),
      getStageDashboard(),
      getRiskDashboard(),
      getServiceDashboard(),
      getAccountDeatil(),
    ])
      .then(([projectsResponse, stagesResponse, risksResponse, servicesResponse, accountResponse]) => {
        setProjectDetail(projectsResponse?.data || []);
        setProjectStage(stagesResponse?.data || []);
        setProjectRiskFactor(risksResponse?.data || []);
        setProjectService(servicesResponse?.data || []);
        SetAccountDeatil(accountResponse?.data || []);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
      });
  }, []); // Run once

  console.log("projectDetail", projectDetail);
  console.log("projectStage", projectStage);
  console.log("projectRiskFactor", projectRiskFactor);
  console.log("projectService", projectService);
  console.log("accountDeatil", accountDeatil);

  useEffect(() => {
    const projectData = projectStage.reduce((acc, proStage) => {
      const projectNo = proStage.projectNo;
      const projectName = proStage.projectName;

      if (projectNo) {
        acc[projectNo] = acc[projectNo] || {
          projectName: projectName || "Unknown Project", // Add project name
          totalCount: 0,
          yesCount: 0,
        };
        acc[projectNo].totalCount += 1;

        // Compare stageStatus to 'yes' correctly
        if (proStage.stageStatus?.trim().toLowerCase() === 'yes') {
          acc[projectNo].yesCount += 1;
        }
      }
      return acc;
    }, {});

    // Calculate individual project percentages
    const calculatedPercentages = Object.entries(projectData).map(([projectNo, data]) => ({
      projectNo,
      projectName: data.projectName, // Include project name
      percentage: data.totalCount > 0
        ? Math.round((data.yesCount / data.totalCount) * 100) // Round to nearest whole number
        : 0, // Avoid division by zero
    }));

    // Calculate overall percentage
    const totalYesCount = Object.values(projectData).reduce((sum, project) => sum + project.yesCount, 0);
    const totalTaskCount = Object.values(projectData).reduce((sum, project) => sum + project.totalCount, 0);
    const overallPercentage = totalTaskCount > 0
      ? Math.round((totalYesCount / totalTaskCount) * 100)
      : 0;

    setProjectPercentages(calculatedPercentages);
    setOverallPercentage(overallPercentage); // Assuming you have a state for overall percentage
  }, [projectStage]);
  console.log("overallPercentage", overallPercentage)
  console.log("setProjectPercentages", projectPercentages)

////////------------------------------------
useEffect(() => {
  const projectServiceData = projectService.reduce((acc, proStage) => {
    const projectNo = proStage.projectNo;
    const projectName = proStage.projectName;

    if (projectNo) {
      acc[projectNo] = acc[projectNo] || {
        projectName: projectName || "Unknown Project", // Add project name
        totalCount: 0,
        yesCount: 0,
      };
      acc[projectNo].totalCount += 1;

      // Compare stageStatus to 'yes' correctly
      if (proStage.serviceStatus?.trim().toLowerCase() === 'yes') {
        acc[projectNo].yesCount += 1;
      }
    }
    return acc;
  }, {});

  // Calculate individual project percentages
  const calculatedPercentages = Object.entries(projectServiceData).map(([projectNo, data]) => ({
    projectNo,
    projectName: data.projectName, // Include project name
    percentage: data.totalCount > 0
      ? Math.round((data.yesCount / data.totalCount) * 100) // Round to nearest whole number
      : 0, // Avoid division by zero
  }));

  // Calculate overall percentage
  const totalYesCount = Object.values(projectServiceData).reduce((sum, project) => sum + project.yesCount, 0);
  const totalTaskCount = Object.values(projectServiceData).reduce((sum, project) => sum + project.totalCount, 0);
  const overallPercentage = totalTaskCount > 0
    ? Math.round((totalYesCount / totalTaskCount) * 100)
    : 0;

  setServiceDaPercentages(calculatedPercentages);
  setOverallServicePercentage(overallPercentage); // Assuming you have a state for overall percentage
}, [projectStage]);
console.log("serviceDaPercentages", serviceDaPercentages)
console.log("overallServicePercentage", overallServicePercentage)
////////////---------------------------
  useEffect(()=>{
    const processedData = projectService.map((project) => ({
      projectNo: project.projectNo,
      projectName: project.projectName,
      service: project.serviceFactor,
    }));

    setprojectServiceData(processedData);

  },[])
  console.log("projectServiceData",projectServiceData)
  //-------------------------
  useEffect(() => {
    const riskData = projectRiskFactor.reduce((acc, proRisk) => {
      const projectNo = proRisk.projectNo;
      const projectName = proRisk.projectName;
      if (projectNo) {
        acc[projectNo] = acc[projectNo] || {
          projectName: projectName || "Unknown Project", // Add project name
          projectNo: projectNo,
          noCount: 0,
        }; // Increment the count if riskStatus is 'no'
        if (proRisk.riskStaus?.trim().toLowerCase() === 'no') {
          acc[projectNo].noCount += 1;
        }
      }
      return acc;
    }, {});
    setProjectRiskFactorCount(riskData)
  }, [projectRiskFactor]);

  useEffect(() => {
    const matchedDetails = projectDetail.map((project) => {
      // Find the matching account details for the current project
      const matchingAccounts = accountDeatil.filter(
        (account) => account.projectNo === project.projectNo
      );

      console.log(`Matching accounts for projectNo ${project.projectNo}:`, matchingAccounts); // Debugging

      // Aggregate debitAmount and extract plannedBudget
      const totalDebitAmount = matchingAccounts.reduce(
        (sum, acc) => sum + acc.debit_Amount,
        0
      );

      const plannedBudget = matchingAccounts.reduce( 
        (sum,acc) => sum+acc.planedBudjet,0);
       

      // Assuming po_Amount is now in accountDeatil and it is part of each account, not the project
      const poAmount = matchingAccounts.length > 0
        ? matchingAccounts[0].po_Amount
        : 0; // Get the PO amount from account details

      // Calculate spent percentage (how much of the planned budget has been used)
      const spentPercentage = plannedBudget > 0
        ? ((totalDebitAmount / plannedBudget) * 100).toFixed(2)
        : 0;

      // Calculate planned budget percentage if poAmount is greater than 0
      const plannedBudgetPercentage = poAmount > 0
        ? (((poAmount - plannedBudget) / poAmount) * 100).toFixed(2)
        : 0; // If poAmount is 0, set plannedBudgetPercentage to 0

      return {
        projectNo: project.projectNo,
        projectName: project.projectName,
        plannedBudget,
        totalDebitAmount,
        spentPercentage,         // Spent percentage (how much has been used)
        plannedBudgetPercentage, // Difference between PO amount and planned budget
        poAmount,
      };
    });

    setFilteredDetails(matchedDetails);
  }, [projectDetail, accountDeatil]);

  console.log("setFilteredDetails", filteredDetails);
  //--------------      

  console.log("setProjectexpances", projectexpance);
  console.log("Risk Data with 'no' count:", projectRiskFactorCount);

  useEffect(() => {
    const ProjectwiseDate = projectDetail.map((proRisk) => ({
      projectNo: proRisk.projectNo || "N/A",
      proStartDate: proRisk.proStartDate || "N/A",
      proPlanedDate: proRisk.proPlanedDate || "N/A",
      proActualDate: proRisk.proActualDate || "N/A",
    }));

    // Extract labels and data
    const labels = ProjectwiseDate.map((data) => data.projectNo);
    const startDates = ProjectwiseDate.map((data) => formatDateToYAxisValue(data.proStartDate));
    const planedDates = ProjectwiseDate.map((data) => formatDateToYAxisValue(data.proPlanedDate));
    const actualDates = ProjectwiseDate.map((data) => formatDateToYAxisValue(data.proActualDate));

    setProjectdatechartData({
      labels,
      datasets: [
        // {
        //   label: "Start Date",
        //   data: startDates,
        //   backgroundColor: "blue",
        //   borderRadius: 10,
        // },
        {
          label: "Planned Date",
          data: planedDates,
          backgroundColor: "rgb(133, 164, 241)",
          borderRadius: 10,
        },
        {
          label: "Actual Date",
          data: actualDates,
          backgroundColor: "rgb(239, 103, 235)",
          borderRadius: 10,
        },
      ],
    });
  }, [projectDetail]);

  // Format a date to be used as Y-axis value (dd.MM as a float)
  const formatDateToYAxisValue = (dateString) => {
    if (!dateString || dateString === "N/A") return null;
    const [day, month] = dateString.split("-");
    return parseFloat(`${month}.${day}`); // Format as `MM.dd` for Y-axis
  };

  // Format a date for labels (dd-MM)
  const formatDateLabel = (value) => {
    if (!value) return "N/A";
    const parts = value.toString().split(".");
    const month = parts[0].padStart(2, "0");
    const day = (parts[1] || "00").padStart(2, "0");
    return `${day}-${month}`; // Format as `dd-MM`
  };

  //projectStatus 
  // Chart data
  const chartData = {
    labels: projectPercentages.map(item => item.projectNo),
    datasets: [
      {
        label: 'Project Percentage',
        data: projectPercentages.map(item => item.percentage), // Rounded percentages
        backgroundColor: 'blue', // Bar color
        borderRadius: 8, // Rounded corners
        barThickness: 25, // Thickness of each bar
      },
    ],
  };

  // Chart options with click event handler
  const options1 = {
    indexAxis: 'y', // Horizontal bar chart
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 36, // Set label font size
            weight: 'bold', // Make label bold
          },
          color: '#000', // Label color
        },
      }, // Hide the legend
      tooltip: { enabled: false },
      title: {
        display: true,
        text: 'PROJECT PROGRESS',
        font: {
          size: 15, // Adjust font size
          weight: 'bold', // Make text bold
        },
        color: 'black'
      },
      datalabels: {
        anchor: 'end', // Position at the end of the bar
        align: 'end', // Align with the bar edge
        formatter: function (value) {
          return `${value}%`; // Format as percentage
        },
        color: '#000', // Text color
        font: {
          size: 15, // Text size
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Percentage",
          font: {
            size: 13, // Adjust font size
            weight: 'bold', // Make text bold
          },
        },
        beginAtZero: true,
        ticks: {
          font: {
            size: 12, // Adjust font size
            weight: 'bold', // Font weight
          },
          color: 'black', // Set tick label color correctly
          callback: function (value) {
            return `${value}%`; // X-axis percentage format
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Projects",
          font: {
            size: 15, // Adjust font size
            weight: 'bold', // Make text bold
          },
        },
        ticks: {
          font: {
            size: 12, // Adjust font size
            weight: 'bold',
          },
          color: 'black', // Set tick label color correctly

        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index; // Get the index of the clicked bar
        const projectClicked = projectPercentages[elementIndex]; // Get the clicked project's data
        const projectDetails = projectStage.filter(project => project.projectNo === projectClicked.projectNo); // Get all matching entries

        setSelectedProjectDetails(projectDetails); // Store all matching details
        togglePopup();
      }
    },
  };
  console.log("setSelectedProjectDetails", selectedProjectDetails)

  //Project serviceDashboard

  const serviceChart = {
    labels: serviceDaPercentages.map(item => item.projectNo),
    datasets: [
      {
        label: 'Project Percentage',
        data: serviceDaPercentages.map(item => item.percentage), // Rounded percentages
        backgroundColor: 'blue', // Bar color
        borderRadius: 8, // Rounded corners
        barThickness: 25, // Thickness of each bar
      },
    ],
  };

  // Chart options with click event handler
  const serviceOption = {
    indexAxis: 'y', // Horizontal bar chart
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 36, // Set label font size
            weight: 'bold', // Make label bold
          },
          color: '#000', // Label color
        },
      }, // Hide the legend
      tooltip: { enabled: false },
      title: {
        display: true,
        text: 'Project Percentage',
        font: {
          size: 15, // Adjust font size
          weight: 'bold', // Make text bold
        },
        color: 'black'
      },
      datalabels: {
        anchor: 'end', // Position at the end of the bar
        align: 'end', // Align with the bar edge
        formatter: function (value) {
          return `${value}%`; // Format as percentage
        },
        color: '#000', // Text color
        font: {
          size: 15, // Text size
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Percentage",
          font: {
            size: 13, // Adjust font size
            weight: 'bold', // Make text bold
          },
        },
        beginAtZero: true,
        ticks: {
          font: {
            size: 12, // Adjust font size
            weight: 'bold', // Font weight
          },
          color: 'black', // Set tick label color correctly
          callback: function (value) {
            return `${value}%`; // X-axis percentage format
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Projects",
          font: {
            size: 15, // Adjust font size
            weight: 'bold', // Make text bold
          },
        },
        ticks: {
          font: {
            size: 12, // Adjust font size
            weight: 'bold',
          },
          color: 'black', // Set tick label color correctly

        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index; // Get the index of the clicked bar
        const projectClicked = projectPercentages[elementIndex]; // Get the clicked project's data
        const projectDetails = projectService.filter(project => project.projectNo === projectClicked.projectNo); // Get all matching entries

        setSelectedServiceProjectDetails(projectDetails); // Store all matching details
        toggleServicePopup();
      }
    },
  };




  //RiskFactor
  const RiskChart = {
    labels: Object.values(projectRiskFactorCount).map((item) => item.projectNo), // Use project names as labels
    datasets: [
      {
        label: 'Risk Count (No)',
        data: Object.values(projectRiskFactorCount).map((item) => item.noCount), // Use noCount as data
        backgroundColor: 'rgb(60, 206, 174)', // Bar color  rgb(87, 132, 198)  rgb(119, 124, 17)
        borderRadius: 8, // Rounded corners for bars
      },
    ],

  };
  // Chart options
  const RiskOprion = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end', // Position at the end of the bar
        align: 'end', // Align with the bar edge
        formatter: function (value) {
          return `${value}`; // Format as percentage
        },
        color: '#000', // Text color
        font: {
          size: 15, // Text size
          weight: 'bold',

        },
      },
      title: {
        display: true,
        text: 'PROJECT KPI\'S',
        font: {
          size: 15, // Adjust font size
          weight: 'bold', // Make text bold
        },
        color: 'black'
      }, // Disable hover tooltips
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Projects",
          font: {
            size: 13, // Adjust font size
            weight: 'bold', // Make text bold
          },
        },
        ticks: {
          font: {
            size: 12, // Adjust font size
            weight: 'bold',
          },
          color: 'black', // Set tick label color correctly

        },

      },
      y: {
        title: {
          display: true,
          text: "Points",
          font: {
            size: 13, // Adjust font size
            weight: 'bold', // Make text bold
          },
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Adjust step size for better readability
          font: {
            size: 12, // Adjust font size
            weight: 'bold', // Make text bold
          },
          color: 'black', // Set tick label color
        },
      },

    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index; // Get the index of the clicked bar
        const projectClicked = projectPercentages[elementIndex]; // Get the clicked project's data
        const projectDetails = projectRiskFactor.filter(project => project.projectNo === projectClicked.projectNo); // Get all matching entries

        setSelectedRiskFactorDetails(projectDetails); // Store all matching details
        toggleRiskFactorPopup();
      }
    },
  };
  console.log("setSelectedProjectRiskFactor", selectedProjectDetails)
  //Project expance
  const projectAmountData = {
    labels: filteredDetails.map(detail => detail.projectNo), // Project numbers
    datasets: [
      {
        label: 'Planned Budget',
        data: filteredDetails.map(detail => detail.plannedBudgetPercentage), // Percentage values for planned budget
        backgroundColor: 'rgba(44, 132, 233, 0.7)', // Green color
        borderRadius: 8, // Rounded corners
        barThickness: 40, // Bar thickness
      },
      {
        label: 'Spenting',
        data: filteredDetails.map(detail => detail.spentPercentage), // Percentage values for spent amount
        backgroundColor: 'rgba(239, 30, 128, 0.7)', // Red color
        borderRadius: 8, // Rounded corners
        barThickness: 40, // Bar thickness
      },
    ],
  };

  // Get the highest percentage value from the data to adjust Y-axis dynamically
  const maxPercentage = Math.max(
    ...filteredDetails.map(detail => Math.max(detail.plannedBudgetPercentage, detail.spentPercentage))
  );

  const projectAmountOption = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'BUDJET - PLANNED/ACTUAL',
        font: {
          size: 15, // Adjust font size
          weight: 'bold', // Make text bold
        },
        color: 'black'

      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = Number(tooltipItem.raw); // Ensure it's a number
            return `${tooltipItem.dataset.label}: ${isNaN(value) ? 0 : value.toFixed(2)}`; // Format the number to 2 decimal places
          },
        },
      },
      datalabels: {
        display: true,
        align: 'end',
        formatter: function (value) {
          const numericValue = Number(value); // Ensure value is a number
          return `${isNaN(numericValue) ? 0 : numericValue.toFixed(2)}`; // Format the number to 2 decimal places
        },
        color: 'black', // White color for text
        font: {
          weight: 'bold',
          size: 14,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "ProjectNo",
          font: {
            size: 13, // Adjust font size
            weight: 'bold', // Make text bold
          },
        },
        beginAtZero: true,
        barPercentage: 0.4, // Adjust gap between bars
        categoryPercentage: 0.4, // Adjust gap between bars
        ticks: {
          font: {
            size: 12, // Adjust font size
            weight: 'bold', // Make text bold
          },
          color: 'black', // Set tick label color
        },
      },
      y: {
        title: {
          display: true,
          text: "Percentage",
          font: {
            size: 13, // Adjust font size
            weight: 'bold', // Make text bold
          },
        },
        beginAtZero: true,
        max: maxPercentage + 10, // Dynamically adjust Y-axis max based on highest percentage
        ticks: {
          stepSize: 10, // Adjust step size for better readability
          font: {
            size: 12, // Adjust font size
            weight: 'bold', // Make text bold
          },
          color: 'black', // Set tick label color
        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index; // Get the index of the clicked bar
        const projectClicked = filteredDetails[elementIndex]; // Get the clicked project's data
        const projectDetails = filteredDetails.filter(project => project.projectNo === projectClicked.projectNo); // Get all matching entries
        setSelectedProjectBudjectDetails(projectDetails); // Store all matching details
        toggleBudjectPopup();
      }
    },
  };

  

    //ServiceFactorBar
    const serviceChartData = {
      labels: projectServiceData.map((item) => `${item.projectNo} - ${item.projectName}`),
      datasets: [
        {
          label: "Project Values",
          data: projectServiceData.map((item) => item.projectName),
          backgroundColor: "#4caf50",
        },
      ],
    };
  
    // Chart options for horizontal bar chart
    const serviceChartOptions = {
      indexAxis: "y", // This makes the bars horizontal
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Project Overview",
          font: {
            size: 16,
            weight: "bold",
          },
          color: "black",
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Value",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          ticks: {
            color: "black",
          },
        },
        y: {
          title: {
            display: true,
            text: "Projects",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          ticks: {
            color: "black",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
      },
    };
  // Ensure that selectedProjectDetails is always an array before calling sort
  const sortedStages = Array.isArray(selectedRiskFactorDetails) && selectedRiskFactorDetails.length > 0
    ? selectedRiskFactorDetails.sort((a, b) => {
        if (a.riskStaus === 'yes' && b.riskStaus === 'no') return -1;  // 'yes' should come before 'no'
        if (a.riskStaus === 'no' && b.riskStaus === 'yes') return 1;   // 'no' should come after 'yes'
        return 0; // Keep original order if both are same status
      })
    : [];

      const serviceBar =()=>{
        setActiveLink("Service");

        setProjectPercenatgeVisible(true); 
        setProjectDasshboardVisible(false)
        setRiskFactorDasshboardVisible(false)
        setPlannedBudjectDasshboardVisible(false)
        setProjectDateDasshboardVisible(false)
      }

      const LiveBar = () => {
        setActiveLink("Live");

        setProjectPercenatgeVisible(false); 
        setProjectDasshboardVisible(true)
        setRiskFactorDasshboardVisible(true)
        setPlannedBudjectDasshboardVisible(true)
        setProjectDateDasshboardVisible(true)
      };
  return (
    <div className='ProjectDashContainer'>
      <div className='projectProgressStatus'>
      <div className="Projectlive">
      <a onClick={LiveBar} style={{ cursor: "pointer",textDecoration: "none",color: activeLink === "Live" ? "white" : "gray",}}> Live</a>      
        </div>
        <div className='ProjectService'>
        <a onClick={serviceBar}style={{cursor: "pointer",textDecoration: "none",color: activeLink === "Service" ? "white" : "gray",}} > Service</a>        </div>
        <div className='dummydataq'></div>
        <div className='DashboardName'>
          <p style={{  fontSize: '30px',fontWeight:'bold' }}>OPREATION DASHBOARD</p>
        </div>
       
        <div className='ProjectProgress'>
          <p>Project Progress</p>
          <PieChart
            series={[
              {
                outerRadius: 58,
                data: [
                  {
                    ...data[0],
                    color: getColorBasedOnPercentage(percentageValue), // Set color dynamically

                  },
                ],
                // arcLabel: getArcLabel,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontSize: 17,
                textAlign:'center'

              },
            }}
            {...sizing}
          />
        </div>
        <div className='overallProjectProg'>
        <p>OverAll Progress</p>
          <div style={{ width: '120px', height: '170px' }}>
            <Gauge
              value={overallPercentage}
              startAngle={-110}
              endAngle={110}
              thickness={35}
              sx={{
                '& .MuiGauge-valueText': {
                  fontSize: 19,
                  transform: 'translate(0px, 0px)',
                },
              }}
              text={({ value, valueMax }) => `${value}`}
            />
          </div>
        </div>
        <div className='dummydata'></div>

      </div>



      <div className='projectStatusDashboard'>
        {projectDasshboardVisible &&(
        <div className='projectStatus'>
          <Bar data={chartData} options={options1} />
        </div>
        )}
        {riskFactorDasshboardVisible && (
        <div className='projectkpi'>
          <Bar data={RiskChart} options={RiskOprion} />
        </div>
        )}
         {projectPercenatgeVisible &&(
        <div className='projectStatus'>
          <Bar data={serviceChart} options={serviceOption} />
        </div>
        )} 

      </div>
      <div className='projectkpiDashboardk'>

      {plannedBudjectDasshboardVisible && (
        <div className='actualandexpance'>
          <Bar data={projectAmountData} options={projectAmountOption} />
        </div>
        )}
        {projectDateDasshboardVisible && (
        <div className='projectcomapricon'>
          {projectdatechartData && (
            <Bar
              data={projectdatechartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'TIME LINE ',
                    font: {
                      size: 15, // Adjust font size
                      weight: 'bold', // Make text bold
                    },
                    color: 'black'
                  },

                  legend: {
                    display: true,
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `Date: ${formatDateLabel(tooltipItem.raw)}`,
                    },
                  },
                  datalabels: {
                    display: true,
                    formatter: (value) => formatDateLabel(value),
                    color: "black",
                    anchor: "end",
                    align: "top",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Projects",
                      font: {
                        size: 13, // Adjust font size
                        weight: 'bold', // Make text bold
                      },
                    },
                    ticks: {
                      font: {
                        size: 12, // Adjust font size
                        weight: 'bold', // Make text bold
                      },
                      color: 'black', // Set tick label color
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Dates (dd-MM)",
                      font: {
                        size: 13, // Adjust font size
                        weight: 'bold', // Make text bold
                      },
                    },
                    ticks: {
                      font: {
                        size: 12, // Adjust font size
                        weight: 'bold', // Make text bold
                      },
                      color: 'black', // Set tick label color
                      callback: (value) => formatDateLabel(value), // Show formatted dates on Y-axis
                    },
                  },
                },
              }}
            />
          )}
        </div>
        )}
      </div>
      {isProjectStageVisible && <div className="blurred-background"></div>}
      {isProjectStageVisible && selectedProjectDetails && (
        <div className='projectStageDetail'>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "#4A148C" }}>
                <TableRow>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    S.No
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    projectNo
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    projectName 
                 </TableCell>
                 <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    stage
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    stageEndDate
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    stageStartDate
                  </TableCell>
                  
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    stageStatus
                  </TableCell>
                  <CloseSharpIcon
                    sx={{ color: "red", fontSize: 30 }}
                    onClick={clocePopup}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProjectDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.projectNo}</TableCell>
                    <TableCell>{row.projectName}</TableCell>
                    <TableCell>{row.stage}</TableCell>
                    <TableCell>{row.stageStartDate}</TableCell>
                    <TableCell>{row.stageEndDate}</TableCell>
             
                    <TableCell>{row.stageStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    {islectedServiceProjectVisible && <div className="blurred-background"></div>}
    {islectedServiceProjectVisible && selectedServiceProjectDetails && (
        <div className='projectServiceDetail'>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "#4A148C" }}>
                <TableRow>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    S.No
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    projectNo
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    projectName 
                 </TableCell>
                 <TableCell style={{ color: "white", fontWeight: "bold" }}>
                 serviceFactor
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  serviceStatus
                  </TableCell>
                  <CloseSharpIcon
                    sx={{ color: "red", fontSize: 30 }}
                    onClick={clocePopup}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedServiceProjectDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.projectNo}</TableCell>
                    <TableCell>{row.projectName}</TableCell>
                    <TableCell>{row.serviceFactor}</TableCell>
                    <TableCell>{row.serviceStatus}</TableCell>             
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

    {isProjectPlanedBudjectVisible && <div className="blurred-background"></div>}
{isProjectPlanedBudjectVisible && selectedProjectBudjectDetails && (
        <div className='projectBujectDetail'>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "#4A148C" }}>
                <TableRow>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    S.No
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    projectNo
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    projectName            </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  poAmount
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  plannedBudget
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                  plannedBudget(%)
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    Expance
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    Expance(%)
                  </TableCell>
                  <CloseSharpIcon
                    sx={{ color: "red", fontSize: 30 }}
                    onClick={clocePopup}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProjectBudjectDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.projectNo}</TableCell>
                    <TableCell>{row.projectName}</TableCell>
                    <TableCell>{row.poAmount}</TableCell>
                    <TableCell>{row.plannedBudget}</TableCell>
                    <TableCell>{row.plannedBudgetPercentage}</TableCell>
                    <TableCell>{row.totalDebitAmount}</TableCell>
                    <TableCell>{row.spentPercentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* {isProjectRiskFactorVisible && selectedRiskFactorDetails && (
        <div className='projectStageDetail'>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "#4A148C" }}>
                <TableRow>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    S.No
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    projectNo
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    projectName            </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    riskStartDate
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    riskEndDate
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    riskFactor
                  </TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>
                    riskStaus
                  </TableCell>
                  <CloseSharpIcon
                    sx={{ color: "red", fontSize: 30 }}
                    onClick={clocePopup}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRiskFactorDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.projectNo}</TableCell>
                    <TableCell>{row.projectName}</TableCell>
                    <TableCell>{row.riskStartDate}</TableCell>
                    <TableCell>{row.riskDate}</TableCell>
                    <TableCell>{row.riskFactor}</TableCell>
                    <TableCell>{row.riskStaus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )} */}
<div className="timeline">
{isProjectRiskFactorVisible && <div className="blurred-background"></div>}
  {isProjectRiskFactorVisible && sortedStages.length > 0 ? (
    
    <div className="projectRiskFactorVisible"> {/* open popup */}
      <div className='projectNo'>
        <p>Project No: {sortedStages[0].projectNo}</p>
      </div>
      <CloseSharpIcon
                    sx={{ color: "red", fontSize: 30}}
                    onClick={clocePopup}
                  />
      {sortedStages.map((stage, index) => (
        <div key={index} className="timeline-item">
          <div className={`circle ${stage.riskStaus === "yes" ? "green" : "red"}`}>
            {index + 1}
          </div>
          <div className="text">
            <h3>Stage {index + 1}</h3>
            <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{stage.riskFactor}</p>
          </div>
          {index < sortedStages.length - 1 && (
            <div
              className={`line ${
                sortedStages[index].riskStaus === "yes" &&
                sortedStages[index + 1].riskStaus === "yes"
                  ? "line-green"
                  : "line-gray"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p></p> 
  )}
</div>

      
    </div>
  );
};

export default ProjectDashBoard;
