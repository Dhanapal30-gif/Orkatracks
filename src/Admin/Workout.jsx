import React from 'react'
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Workout = () => {
    const data = {
        labels: [
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ],
        datasets: [
          {
            label: "Expenses",
            data: [500, 600, 450, 700, 650, 500, 750, 800, 550, 650, 700, 850], // Example expenses for 12 months
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",  // January
              "rgba(54, 162, 235, 0.6)",  // February
              "rgba(255, 206, 86, 0.6)",  // March
              "rgba(75, 192, 192, 0.6)",  // April
              "rgba(153, 102, 255, 0.6)", // May
              "rgba(255, 159, 64, 0.6)",  // June
              "rgba(255, 99, 132, 0.6)",  // July
              "rgba(54, 162, 235, 0.6)",  // August
              "rgba(255, 206, 86, 0.6)",  // September
              "rgba(75, 192, 192, 0.6)",  // October
              "rgba(153, 102, 255, 0.6)", // November
              "rgba(255, 159, 64, 0.6)"   // December
            ], // Unique color for each month
            borderColor: [
              "rgba(255, 99, 132, 1)", 
              "rgba(54, 162, 235, 1)", 
              "rgba(255, 206, 86, 1)", 
              "rgba(75, 192, 192, 1)", 
              "rgba(153, 102, 255, 1)", 
              "rgba(255, 159, 64, 1)", 
              "rgba(255, 99, 132, 1)", 
              "rgba(54, 162, 235, 1)", 
              "rgba(255, 206, 86, 1)", 
              "rgba(75, 192, 192, 1)", 
              "rgba(153, 102, 255, 1)", 
              "rgba(255, 159, 64, 1)"
            ], // Border color for each bar
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true, // Enable tooltips to show when hovering over a bar
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        animation: {
          duration: 1000, // Adds animation to the chart
        },
      };
    
      // Function to render expense values on top of each bar
      const renderChartData = (data) => {
        return data.datasets[0].data.map((value, index) => {
          return (
            <text
              key={index}
              x={index * 90 + 45} // Adjust based on your chart's spacing
              y={data.datasets[0].data[index] - 10} // Position the text above the bar
              fill="black"
              fontSize={12}
              fontWeight="bold"
              textAnchor="middle"
            >
              ${value}
            </text>
          );
        });
      };
    
      return (
        <div style={{ width: "37%", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", color: "#333" }}>Monthly Expenses</h2>
          <Bar data={data} options={options}>
            {renderChartData(data)}
          </Bar>
        </div>
      );
    
    
}

export default Workout