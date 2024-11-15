import React, { useState, useEffect } from 'react';
import './Performance.css';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { getMonthly, getWeekly } from '../Services/Services';
import { BarChart } from '@mui/x-charts/BarChart';

const Performance = () => {
    const [weeklyDetail, setWeeklyDetail] = useState([]);
    const [monthlyDetail, setMonthlyDetail] = useState({});

    const getWeeklyTask = () => {
        getWeekly()
            .then((response) => {
                const data = Array.isArray(response.data) ? response.data : [];
                setWeeklyDetail(data);
                console.log("Weekly Detail:", data);
            })
            .catch((error) => {
                console.error("Error fetching weekly tasks:", error);
            });
    };

    const getMonthlyTask = () => {
        getMonthly()
            .then((response) => {
                const data = response.data || {}; // Ensure data is an object
                setMonthlyDetail(data); // Store data grouped by month
                console.log("Monthly Detail (grouped by month):", data); // Log grouped data
            })
            .catch((error) => {
                console.error("Error fetching monthly tasks:", error);
            });
    };

    useEffect(() => {
        getWeeklyTask();
        getMonthlyTask();
    }, []);

    // Calculate weekly task statuses
    const totalTasks = weeklyDetail.length;
    const ongoingTasks = weeklyDetail.filter(task => task.status === 'Ongoing').length;
    const notStartedTasks = weeklyDetail.filter(task => task.status === 'NotStarted').length;
    const closedTasks = weeklyDetail.filter(task => task.status === 'Closed').length;
    const weeklyPerofrm = (closedTasks / totalTasks) * 100;

    // Monthly tasks data
    const months = Object.keys(monthlyDetail); // Array of months
    const taskCounts = months.map((month) => monthlyDetail[month].length); // Number of tasks per month
    console.log("yearly", monthlyDetail.length)
    // Group tasks by status for each month
    const ongoingCounts = months.map((month) =>
        monthlyDetail[month].filter(task => task.status === 'Ongoing').length
    );
    const closedCounts = months.map((month) =>
        monthlyDetail[month].filter(task => task.status === 'Closed').length
    );
    const notStartedCounts = months.map((month) =>
        monthlyDetail[month].filter(task => task.status === 'NotStarted').length
    );

    // Monthly performance calculations
    const totalMonthlyTasks = taskCounts.reduce((acc, count) => acc + count, 0); // Total tasks across all months
    const ongoingMonthlyTasks = ongoingCounts.reduce((acc, count) => acc + count, 0);
    const notStartedMonthlyTasks = notStartedCounts.reduce((acc, count) => acc + count, 0);
    const closedMonthlyTasks = closedCounts.reduce((acc, count) => acc + count, 0);

    const monthlyPerformance = (closedMonthlyTasks / totalMonthlyTasks) * 100;

    // Calculate percentage for each group based on the total tasks per month
    const ongoingPercentage = months.map((month) => {
        const totalTasksInMonth = monthlyDetail[month].length;
        return (ongoingCounts[months.indexOf(month)] / totalTasksInMonth) * 100;
    });

    const closedPercentage = months.map((month) => {
        const totalTasksInMonth = monthlyDetail[month].length;
        return (closedCounts[months.indexOf(month)] / totalTasksInMonth) * 100;
    });

    const notStartedPercentage = months.map((month) => {
        const totalTasksInMonth = monthlyDetail[month].length;
        return (notStartedCounts[months.indexOf(month)] / totalTasksInMonth) * 100;
    });

    // Get an array of all tasks across all months
const allTasks = Object.values(monthlyDetail).flat(); // Flatten all tasks into a single array

// Calculate total tasks and closed tasks
const totalTask = allTasks.length; // Total tasks for the year
const closedTask = allTasks.filter(task => task.status === 'Closed').length; // Closed tasks
const remainingTasks = totalTask - closedTask; // Tasks not closed

// Convert to a percentage out of 100
const yearlyPerformancePercentage = (remainingTasks / totalTask) * 100;


    const settings = {
        width: 200,
        height: 200,
        value: yearlyPerformancePercentage,
    };
    return (
        <div>
            {/* Weekly Performance */}
            <div className="weekly">
                <h4 style={{ marginTop: '-70px', marginLeft: '-70px',fontSize:'19px', width: '57%',textAlign:'left' }}>
                    Weekly Performance
                </h4>
                
                <Gauge
                    value={weeklyPerofrm}
                    startAngle={-110}
                    endAngle={110}
                    style={{ marginLeft: '87px' }}
                    sx={{
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 30,
                            transform: 'translate(0px, 0px)',
                        },
                    }}
                    text={({ value }) => `${value.toFixed(1)}%`}
                />
                <div style={{ marginLeft: '-50px', textAlign: 'left', marginTop: '-70px' }}>
                    <p>Total Task: {totalTasks}</p>
                    <p>Ongoing Task: {ongoingTasks}</p>
                    <p>Not started: {notStartedTasks}</p>
                    <p>Closed: {closedTasks}</p>
                </div>
            </div>

            {/* Monthly Performance */}
            <div className='Monthly'>
                {/* BarChart for monthly task counts */}
                <h4 style={{ marginTop: '-70px', marginLeft: '-70px',fontSize:'19px', width: '30%',textAlign:'left'}}>
                Monthly Performance
                </h4>
                <BarChart
                    xAxis={[{ scaleType: 'band', data: months }]} // Months as X-axis labels
                    yAxis={[{
                        scaleType: 'linear', // Y-axis should be a linear scale (for task counts)
                        min: 0,              // Start from 0%
                        max: 100,            // End at 100%
                        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Tick marks at these percentages
                        tickFormat: (value) => `${value}%`, // Format Y-axis ticks as percentage
                    }]}
                    series={[
                        { data: ongoingPercentage, label: 'Ongoing' },    // Data for ongoing tasks as percentage
                        { data: closedPercentage, label: 'Closed' },       // Data for closed tasks as percentage
                        { data: notStartedPercentage, label: 'Not Started' }, // Data for not started tasks as percentage
                    ]}
                    width={400} // Adjust width
                    height={400} // Adjust height
                    sx={{
                        '& .MuiBarChart-bar': {
                            fill: '#4caf50', // Default color for ongoing tasks (green)
                        },
                        '& .MuiBarChart-bar:first-of-type': {
                            fill: '#FF9800', // Ongoing tasks (orange)
                        },
                        '& .MuiBarChart-bar:nth-of-type(2)': {
                            fill: '#F44336', // Closed tasks (red)
                        },
                        '& .MuiBarChart-bar:nth-of-type(3)': {
                            fill: '#FF5722', // Not Started tasks (deep orange)
                        }
                    }}
                />
            </div>
            <div className='Yearly'>
            <h4 style={{ marginTop: '-70px', marginLeft: '-70px',fontSize:'19px',width: '57%',textAlign:'left' }}>
                    Yearly Performance
                </h4>
                <Gauge
                    {...settings}
                    cornerRadius="50%"
                    sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: '#52b202',
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.disabled,
                        },
                    })}
                />

            </div>
        </div>
    );
};

export default Performance;
