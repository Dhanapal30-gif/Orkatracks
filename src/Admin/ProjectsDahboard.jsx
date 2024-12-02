import React, { useEffect, useState } from 'react';
import { getProjectsDashboard } from '../Services/Services';
import './Admin.css';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend,ChartDataLabels);

const ProjectsDashboard = () => {
  const [getProjectDashboard, setGetProjectDashboard] = useState([]);
  const [storeProject, setStoreProject] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartData1, setChartData1] = useState(null);
  const [storeprojectStuck, setStoreprojectStuck] = useState([]);
  const [getSetComaprison, setGetSetComaprison] = useState([]);

  
  
  const rowColors = [
    'table-primary',
    'table-secondary',
    'table-success',
    'table-danger',
    'table-warning',
  ];

  const projectStuck = [
    { backgroundColor: '#272757' }, // Light red
    { backgroundColor: '#CF5376' }, // Light blue
    { backgroundColor: '#5B8040' }, // Light green
    { backgroundColor: '#660F09' }, // Slightly darker red
    { backgroundColor: '#660033' }, // Light yellow
];
const projectName = [
    { backgroundColor: '#00F0FF' }, // Light red
    { backgroundColor: '#00FF81' }, // Light blue
    { backgroundColor: '#FFA900' }, // Light green
    { backgroundColor: '#FFBF00' }, // Slightly darker red
    { backgroundColor: '#F8BBD0' }, // Light yellow
];
  // Fetch project dashboard details on component mount
  useEffect(() => {
    getProjectsDashboardDeatil();
  }, []);

  const getProjectsDashboardDeatil = () => {
    getProjectsDashboard()
      .then((response) => {
        console.log('getProjectDashboard', response.data);
        setGetProjectDashboard(response.data || []);
      })
      .catch((error) => {
        console.log('Error GetProjectDashboard details:', error);
      });
  };

  // Filter and store project details
  useEffect(() => {
    if (getProjectDashboard.length > 0) {
      const fetchProject = getProjectDashboard.map((dashboard) => ({
        projectNo: dashboard.projectNo,
        projectName: dashboard.projectName,
      }));
      setStoreProject(fetchProject);

      const projectStuck = getProjectDashboard.map((dashboard) => ({
        projectNo: dashboard.projectNo,
        projectStuck: dashboard.projectStuck,
        nextMove:dashboard.nextMove,
      }));
      setStoreprojectStuck(projectStuck);

      const projectComparison = getProjectDashboard.map((dashboard) => ({
        projectNo: dashboard.projectNo,
        actualDate: dashboard.actualDate,
        fixingDate:dashboard.fixingDate,
      }));
      setGetSetComaprison(projectComparison);
      const labels = getProjectDashboard.map((dashboard) => ` ${dashboard.projectNo}`);
      const statuses = getProjectDashboard.map((dashboard) => dashboard.projectStatus || 0);
      const colors = generateDarkColors(statuses.length);


      const labels1 = getProjectDashboard.map((dashboard) => ` ${dashboard.projectNo}`);
      const statuses1 = getProjectDashboard.map((dashboard) => dashboard.actualDate || 0);
      const statuses2 = getProjectDashboard.map((dashboard) => dashboard.fixingDate || 0);
      const colors1 = generateDarkColors(statuses.length);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Project Status (%)',
            data: statuses,
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace('0.8', '1')),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [getProjectDashboard]);

  useEffect(() => {
    if (getProjectDashboard.length > 0) {
      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
      };
  
      const labels = getProjectDashboard.map((dashboard) => ` ${dashboard.projectNo}`);
  
      const actualDates = getProjectDashboard.map((dashboard) => {
        const date = dashboard.actualDate ? parseDate(dashboard.actualDate).getTime() : null;
        return isNaN(date) ? null : date;
      });
  
      const fixingDates = getProjectDashboard.map((dashboard) => {
        const date = dashboard.fixingDate ? parseDate(dashboard.fixingDate).getTime() : null;
        return isNaN(date) ? null : date;
      });
  
      // Create the chart data for both fixing and actual dates with color change logic
      setChartData1({
        labels,
        datasets: [
          {
            label: 'Fixing Date',
            data: fixingDates,
            backgroundColor: '#12d000', // Blue color for fixing date
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Actual Date',
            data: actualDates,
            backgroundColor: actualDates.map((actualDate, index) => {
              // Check if the actual date is greater than the fixing date and apply color
              return actualDate > fixingDates[index]
                ? '#ff2900'  // Red color if actual date crosses fixing date
                : '#ff00bd'; // Blue color if actual date does not cross fixing date
            }),
            borderColor: '#4d193f',
            //borderWidth: 3,
          },
        ],
      });
    }
  }, [getProjectDashboard]);
  
  
  const generateDarkColors = (count) => {
    return Array.from({ length: count }, () =>
      `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, 0.8)`
    );
  };

  return (
    <div>
    {/* <h3>Projects Dashboard</h3> */}

    
    <div className="Dashboard1">
  <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse',fontFamily: "Arial, sans-serif", }}>
    <thead>
      <tr>
        <th
          scope="col"
          style={{
            padding: '10px',
            backgroundColor: 'white', // Set background to white
            color: 'black', // Set text color to orange
            fontSize: '18px',
          }}
        >
          Project No
        </th>
        <th
          scope="col"
          style={{
            padding: '10px',
            backgroundColor: 'white', // Set background to white
            color: 'black', // Set text color to orange
            fontSize: '18px',
          }}
        >
          Project Stuck
        </th>
      </tr>
    </thead>
    <tbody>
      {storeprojectStuck.map((project, index) => {
        const backgroundColor = projectName[index % projectName.length].backgroundColor;
        return (
          <tr key={index} style={{ backgroundColor }}>
            <td style={{ padding: '10px',color:'black'}}>{project.projectNo}</td>
            <td style={{ padding: '10px',color:'black' }}>{project.nextMove}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

    
<div style={{ marginTop: '-279px', width: '40%', marginLeft: '50%' }}>
  {chartData && (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
            },
          },
          datalabels: {
            display: true, // Always display labels
            color: 'black',
            weight: 'bold', // Color of the labels
            font: {
              weight: 'bold',
              size: 14,
            },
            formatter: (value) => `${value}%`, // Format the value as percentage
            anchor: 'end', // Position the label at the end of the bar
            align: 'top', // Position the label on top of the bar
          },
        },
        scales: {
       
        y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              font: {
                weight: 'bold', // Bold text for Y-axis labels
              },
            },
            title: {
              display: true,
              text: 'Completion (%)',
              font: {
                weight: 'bold', // Make Y-axis title bold
                size: 18, // Adjust the title font size
                color: 'green', // Change title color (optional)
              },
            },
          },
          x: {

            ticks: {
                font: {
                  weight: 'bold', // Bold text for Y-axis labels
                },
              },
            title: {
              display: true,
              text: 'Projects',
              color: 'black',
              font: {
                weight: 'bold', // Make Y-axis title bold
                size: 18, // Adjust the title font size
              },
            },
          },
        },
      }}
      // Update the data property to customize bar colors
      data1={{
        ...chartData,
        datasets: [
          {
            ...chartData.datasets[0],
            backgroundColor: ['#ffa000', '#33FF57','#9900ef','#827717', '#07efff'], // Example custom bar colors (red, green, blue)
            borderColor: ['#FF5733', '#33FF57', '#3357FF'], // Matching border colors
            borderWidth: 1,
          },
        ],
      }}
    />
  )}
</div>


<div className="Dashboard2">
  <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th
          scope="col"
          style={{
            padding: '10px',
            backgroundColor: 'white', // Set background to white
            color: 'black', // Set text color to orange
            fontSize: '18px',
            fontFamily: "Arial, sans-serif",

          }}
        >
          Project No
        </th>
        <th
          scope="col"
          style={{
            padding: '10px',
            backgroundColor: 'white', // Set background to white
            color: 'black', // Set text color to orange
            fontSize: '18px',
          }}
        >
          Project Stuck
        </th>
        <th
          scope="col"
          style={{
            padding: '10px',
            backgroundColor: 'white', // Set background to white
            color: 'black', // Set text color to orange
            fontSize: '18px',
          }}
        >
          Next Move
        </th>
      </tr>
    </thead>
    <tbody>
      {storeprojectStuck.map((project, index) => {
        const backgroundColor = projectStuck[index % projectStuck.length].backgroundColor;
        return (
          <tr key={index} style={{ backgroundColor }}>
            <td style={{ padding: '10px',color:'white'}}>{project.projectNo}</td>
            <td style={{ padding: '10px',color:'white' }}>{project.projectStuck}</td>
            <td style={{ padding: '10px',color:'white' }}>{project.nextMove}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

{/* /// */}

<div style={{ marginTop: '-249px', width: '40%', marginLeft: '50%' }}>
  {chartData1 && (
    <Bar
      data={chartData1}
      options={{
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const date = new Date(tooltipItem.raw);
                // Format tooltip date as dd/mm/yyyy
                const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                return `${tooltipItem.dataset.label}: ${formattedDate}`;
              },
            },
          },
          datalabels: {
            display: true,
            formatter: (value) => {
              const date = new Date(value);  // Assuming your value is a timestamp or date
              // Format date as dd/mm (only for top of the bar)
              return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
            },
            color: 'black',
            font: { size: 12, weight: 'bold' },
            anchor: 'end',
            align: 'top',
            offset: 5,  // Adjust the distance from the top of the bar
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              font: {
                weight: 'bold',
                color:'blue',
                fontFamily: "Arial, sans-serif", // Bold text for Y-axis labels
              },             callback: (value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
              },
              
            },
            title: {
              display: true,
              text: 'Dates',
              font: { size: 18,weight: 'bold'},
              color: 'black',
              fontFamily: "Arial, sans-serif",
            },
          },
          x: {
            ticks: {
              font: {
                weight: 'bold',
                color:'blcak' ,
                fontFamily: "Arial, sans-serif",// Bold text for Y-axis labels
              },
            },
            title: {
              display: true,
              weight: 'bold',
              text: 'projects',
              font: { size: 18,weight: 'bold' },
              color: 'black',
              fontFamily: "Arial, sans-serif",
            },
          },
        },
      }}
    />
  )}
</div>



  </div>
);
};

export default ProjectsDashboard; // working fine 