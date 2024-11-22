import React, { useEffect, useState } from "react";
import './Admin.css'
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';

import { AiFillCodeSandboxCircle } from "react-icons/ai";
import { AiFillCheckSquare } from "react-icons/ai";
import { AiFillCaretDown } from "react-icons/ai";
import { MdTrendingUp } from "react-icons/md";
import { BiCoinStack } from "react-icons/bi";
import { Bar } from "react-chartjs-2";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getAccountDeatil, getProjectMangement } from "../Services/Services";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
    });
    const [formData1, setFormData1] = useState({
        projectNo: '',
        startDate: "",
        endDate: "",
    });
    const [formErrors, setFormErrors] = useState({ projectNo: '' });
    const [getAccountDetail, setGetAccountDetail] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalpoAmount, setTotalpoAmount] = useState(0);
    const [gettotalExpanse, setTotalExpanse] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [overallProfit, setOverallProfit] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredData1, setFilteredData1] = useState([]);
    const [filteredData2, setFilteredData2] = useState([]);
    const [filteredData3, setFilteredData3] = useState([]);
    const [totalpoAmount1, setTotalpoAmount1] = useState(0);
    const [totalExpanse1, setTotalExpanse1] = useState(0);
    const [totalIncome1, setTotalIncome1] = useState(0);
    const [totalbudject, setTotalBudject] = useState(0);

    const [overallProfit1, setOverallProfit1] = useState(0);
    const [getProject, setGetProject] = useState([]);
    const [getProjectNo, setGetProjectNo] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [dynamicLabels, setDynamicLabels] = useState([]);

    const handleChangeFormData = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangeFormData1 = (e) => {
        const { name, value } = e.target;
        const fieldName = name.replace("_formData1", ""); // Remove '_formData1' from name
        setFormData1({
            ...formData1,
            [fieldName]: value, // Set the updated field value in formData1
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData1({
            ...formData1,
            [name]: value,
        });
    };


    const validateForm = () => {
        const errors = {};
        if (!formData.startDate) errors.startDate = "Start Date is required";
        if (!formData.endDate) errors.endDate = "End Date is required";
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            errors.endDate = "End Date must be after Start Date";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        getAccountDea();
        overall();
        getData();
    }, []);
    const getAccountDea = () => {
        getAccountDeatil()
            .then((response) => {

                console.log("getAccountDeatil", response.data);
                setGetAccountDetail(Array.isArray(response.data) ? response.data : []);

            })
            .catch((error) => {
                console.log('Error fetching employee details:', error);
            });
    };
    useEffect(() => {
        const calculateMonthlyExpenses = () => {
            const monthlyData = {};
            const uniqueMonths = new Set();
    
            // Process each record in getAccountDetail
            getAccountDetail.forEach((item) => {
                // Parse the date
                const date = new Date(item.date);
                if (isNaN(date)) return; // Skip invalid dates
    
                // Extract month and year
                const month = date.toLocaleString("default", { month: "long" }); // e.g., "January"
                const year = date.getFullYear();
                const label = `${month} ${year}`; // e.g., "January 2024"
    
                // Add label to uniqueMonths
                uniqueMonths.add(label);
    
                // Aggregate expenses for the month
                const key = `${year}-${date.getMonth()}`; // Create unique key for the month
                monthlyData[key] = (monthlyData[key] || 0) + (item.debit_Amount || 0);
            });
    
            // Sort the unique months chronologically
            const sortedLabels = Array.from(uniqueMonths).sort((a, b) => {
                const [monthA, yearA] = a.split(" ");
                const [monthB, yearB] = b.split(" ");
                const dateA = new Date(`${monthA} 1, ${yearA}`);
                const dateB = new Date(`${monthB} 1, ${yearB}`);
                return dateA - dateB;
            });
    
            // Map the sorted labels to their corresponding expense totals
            const expenses = sortedLabels.map((label) => {
                const [month, year] = label.split(" ");
                const key = `${year}-${new Date(`${month} 1, ${year}`).getMonth()}`;
                return monthlyData[key] || 0;
            });
    
            setDynamicLabels(sortedLabels);
            setMonthlyExpenses(expenses);
        };
    
        calculateMonthlyExpenses();
    }, [getAccountDetail]);

    
    const getData = () => {
        getProjectMangement()
            .then((response) => {
                setGetProject(response.data);
                console.log("uywge9yguygh", response.data);

            })
            .catch((error) => {
            });
    };
    console.log("getData", getProject);
    const overall = () => {
        //overallpoamount
        const overallpoAmount = getAccountDetail.filter(Account => Account.po_Amount).map(account => account.po_Amount);
        const totalpoAmount = overallpoAmount.reduce((sum, amount) => sum + amount, 0);
        setTotalpoAmount(totalpoAmount) // Calculate total
        console.log("Individual PO Amounts:", overallpoAmount);
        console.log("Total PO Amount:", totalpoAmount);

        //overallexpanse
        const overallExpanse = getAccountDetail.filter(Account => Account.debit_Amount).map(account => account.debit_Amount);
        const totalexpanse = overallExpanse.reduce((sum, amount) => sum + amount, 0);
        setTotalExpanse(totalexpanse)// Calculate total
        console.log("Individual PO Amounts:", overallpoAmount);
        console.log("Total PO Amount:", totalpoAmount);
        //overallincome
        const overallIncome = getAccountDetail.filter(Account => Account.credit_Amount).map(account => account.credit_Amount);
        const totalIncome = overallIncome.reduce((sum, amount) => sum + amount, 0);
        setTotalIncome(totalIncome)// Calculate total
        console.log("Individual PO Amounts:", overallpoAmount);
        console.log("Total PO Amount:", totalpoAmount);


        const profit = totalpoAmount - totalexpanse + totalIncome;
        setOverallProfit(profit)
    }

    const handleView = () => {
        if (!validateForm()) return;

        // Convert the start and end dates to Date objects
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        // Check if the dates are valid
        if (isNaN(startDate) || isNaN(endDate)) {
            console.error("Invalid start or end date.");
            return;
        }
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const filtered = getAccountDetail.filter((item) => {
            if (!item.date) {
                console.error("Missing date in item:", item);
                return false;
            }
            const itemDate = convertDateFormat(item.date);
            const parsedItemDate = new Date(itemDate);
            if (isNaN(parsedItemDate)) {
                console.error("Invalid date in item:", item.date);
                return false;
            }
            parsedItemDate.setHours(0, 0, 0, 0);
            return parsedItemDate >= startDate && parsedItemDate <= endDate;
        });

        setFilteredData(filtered); // Set filtered data for display

        // const filtered1 = getProject.filter((item) => {
        //     // Ensure item.startDate exists
        //     if (!item.startDate) {
        //         console.error("Missing startDate in item:", item);
        //         return false; // Skip items with missing startDate
        //     }

        //     // Convert startDate to Date object directly, assuming it's already in a valid ISO format
        //     const parsedItemDate = new Date(item.startDate);

        //     // Check if the date is valid
        //     if (isNaN(parsedItemDate)) {
        //         console.error("Invalid startDate in item:", item.startDate);
        //         return false; // Skip invalid dates
        //     }

        //     // Normalize the time to midnight for accurate comparison
        //     parsedItemDate.setHours(0, 0, 0, 0);

        //     // Perform the comparison with the provided startDate and endDate
        //     return parsedItemDate >= startDate && parsedItemDate <= endDate;
        // });


        // setFilteredData1(filtered1); // Set filtered data for display

        const totalPO = filtered
            .filter(account => account.po_Amount)
            .reduce((sum, account) => sum + account.po_Amount, 0);

        const totalExp = filtered
            .filter(account => account.debit_Amount)
            .reduce((sum, account) => sum + account.debit_Amount, 0);

        const totalInc = filtered
            .filter(account => account.credit_Amount)
            .reduce((sum, account) => sum + account.credit_Amount, 0);

        // Set calculated values
        setTotalpoAmount(totalPO);
        setTotalExpanse(totalExp);
        setTotalIncome(totalInc);
        setOverallProfit(totalPO - totalExp + totalInc);
    };

    // Helper function to convert "DD-MM-YYYY" to "YYYY-MM-DD"
    const convertDateFormat = (date) => {
        const [day, month, year] = date.split("-"); // Split "DD-MM-YYYY"
        return `${year}-${month}-${day}`; // Return "YYYY-MM-DD"
    };


    function Line({ orientation = "horizontal", color = "orange", thickness = "2px", length = "100%" }) {
        const style =
            orientation === "horizontal"
                ? { borderTop: `${thickness} solid ${color}`, width: length, margin: "10px 0" }
                : { backgroundColor: color, width: thickness, height: length, margin: "0 10px" };

        return <div style={style} />;
    }

    function Line1({ orientation = "horizontal", color = "orange", thickness = "2px", length = "100%" }) {
        const style =
            orientation === "horizontal"
                ? { borderTop: `${thickness} solid ${color}`, width: length, margin: "10px 0" }
                : { backgroundColor: color, width: thickness, height: length, margin: "0 10px" };

        return <div style={style} />;
    }

    // Chart data configuration
    const data = {
        labels: dynamicLabels, // Use dynamically generated labels
        datasets: [
            {
                label: "Expenses",
                data: monthlyExpenses, // Use calculated monthly expenses
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 3.7,
            },
        ],
    };
    // //barchart
    // const data = {
    //     labels: [
    //         "January", "February", "March", "April", "May", "June",
    //         "July", "August", "September", "October", "November", "December"
    //     ],
    //     datasets: [
    //         {
    //             label: "Expenses",
    //             data: [500, 600, 450, 700, 650, 500, 750, 800, 550, 650, 700, 850], // Example expenses for 12 months
    //             backgroundColor: [
    //                 "rgba(255, 99, 132, 0.6)",  // January
    //                 "rgba(54, 162, 235, 0.6)",  // February
    //                 "rgba(255, 206, 86, 0.6)",  // March
    //                 "rgba(75, 192, 192, 0.6)",  // April
    //                 "rgba(153, 102, 255, 0.6)", // May
    //                 "rgba(255, 159, 64, 0.6)",  // June
    //                 "rgba(255, 99, 132, 0.6)",  // July
    //                 "rgba(54, 162, 235, 0.6)",  // August
    //                 "rgba(255, 206, 86, 0.6)",  // September
    //                 "rgba(75, 192, 192, 0.6)",  // October
    //                 "rgba(153, 102, 255, 0.6)", // November
    //                 "rgba(255, 159, 64, 0.6)"   // December
    //             ], // Unique color for each month
    //             borderColor: [
    //                 "rgba(255, 99, 132, 1)",
    //                 "rgba(54, 162, 235, 1)",
    //                 "rgba(255, 206, 86, 1)",
    //                 "rgba(75, 192, 192, 1)",
    //                 "rgba(153, 102, 255, 1)",
    //                 "rgba(255, 159, 64, 1)",
    //                 "rgba(255, 99, 132, 1)",
    //                 "rgba(54, 162, 235, 1)",
    //                 "rgba(255, 206, 86, 1)",
    //                 "rgba(75, 192, 192, 1)",
    //                 "rgba(153, 102, 255, 1)",
    //                 "rgba(255, 159, 64, 1)"
    //             ], // Border color for each bar
    //             borderWidth: 3.7,
    //         },
    //     ],
    // };

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
                ticks: {
                    color: "white", // Set X-axis labels (e.g., months) to white
                    font: {
                        size: 14, // Adjust font size
                        weight: "bold", // Make the text bold
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "white", // Change the side row (Y-axis values) to white
                    font: {
                        size: 14, // Adjust font size
                        weight: "bold", // Make the text bold
                    },
                },
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
                    fill="white"
                    fontSize={12}
                    fontWeight="bold"
                    textAnchor="middle"
                    color='white'
                >
                    ${value}
                </text>
            );
        });
    };
    //barchart//

    const yearlyPerformancePercentage = 7894789;
    const yearlyPerformancePercentage1 = 7894789;
    const yearlyPerformancePercentage2 = 7894789;


    const settings = {
        width: 200,
        height: 170,
        value: totalpoAmount1,
        color: "white",                 // Text color
    };

    // const setting1 = {
    //     width: 200,
    //     height: 170,
    //     value: yearlyPerformancePercentage1,
    // };


    useEffect(() => {
        const projectnumber = getAccountDetail
            .filter(account => account.projectNo) // Ensure projectNo exists
            .map(account => ({
                value: account.projectNo, // Unique identifier for value
                label: account.projectNo // What is displayed in dropdown
            }));
        setGetProjectNo(projectnumber);
    }, [getProject]);

    console.log("formdata", formData1)
    useEffect(() => {
        // Ensure the data is only fetched when necessary
        if (formData1.startDate && formData1.endDate && formData1.projectNo) {
            getProjectwiseAccountDetail();
        }
    }, [formData1]);
    const getProjectwiseAccountDetail = () => {
        // Avoid unnecessary state updates inside the function if the data is unchanged
        //const startDate = new Date(formData1.startDate);
        //const endDate = new Date(formData1.endDate);
        const projectNo = formData1.projectNo;

        // Set the hours to ensure we're comparing whole days (ignores time)
        //startDate.setHours(0, 0, 0, 0);
        //endDate.setHours(23, 59, 59, 999);

        const filtered = getAccountDetail.filter((item) => {
            const itemDate = convertDateFormat(item.date);
            const parsedItemDate = new Date(itemDate);

            if (isNaN(parsedItemDate)) {
                console.error("Invalid date in item:", item.date);
                return false;
            }

            parsedItemDate.setHours(0, 0, 0, 0);

            return (
                item.projectNo === projectNo

            );
        });

        if (filtered.length === 0) return;

        setFilteredData1(filtered);

        const totalPO1 = filtered
            .filter(account => account.po_Amount)
            .reduce((sum, account) => sum + account.po_Amount, 0);

        const totalExp1 = filtered
            .filter(account => account.debit_Amount)
            .reduce((sum, account) => sum + account.debit_Amount, 0);

        const totalInc1 = filtered
            .filter(account => account.credit_Amount)
            .reduce((sum, account) => sum + account.credit_Amount, 0);

        const totalbudjectu = filtered
            .filter(account => account.planedBudjet)
            .reduce((sum, account) => sum + account.planedBudjet, 0);


        if (totalPO1 !== totalpoAmount1) setTotalpoAmount1(totalPO1);
        if (totalExp1 !== totalExpanse1) setTotalExpanse1(totalExp1);
        if (totalInc1 !== totalIncome1) setTotalIncome1(totalInc1);
        if (totalbudjectu !== totalbudject) setTotalBudject(totalbudjectu);
        if (totalPO1 - totalExp1 + totalInc1 !== overallProfit1) setOverallProfit1(totalPO1 - totalExp1 + totalInc1);
    }

    console.log("getTotalPoAmount", totalpoAmount1)
    console.log("setTotalExpanse1", totalExpanse1)
    console.log("setTotalIncome1", totalIncome1)
    console.log("setTotalBudject", totalbudject)

    const percentageIncome = totalpoAmount1 > 0
        ? Math.min((totalIncome1 / totalpoAmount1) * 100, 100)
        : 0;

    const percentagebudjett = totalpoAmount1 > 0
        ? Math.min((totalbudject / totalpoAmount1) * 100, 100)
        : 0;

    const percentageExpan = totalbudject > 0
        ? Math.min((totalExpanse1 / totalbudject) * 100, 100)
        : 0;


    const differenceAmount = totalIncome1 - totalpoAmount1;



    const gaugeColor =
        percentageExpan > 75
            ? "#ff0000" // Red for > 75%
            : percentageExpan > 50
                ? "#ffa500" // Orange for > 50%
                : "#ffff00"; // Yellow for <= 50%

    const setting3 = {
        width: 200,
        height: 170,
        value: percentageExpan, // Percentage value for the gauge
        max: 100, // Maximum always represents the full budget
    };

    const setting1 = {
        width: 200,
        height: 170,
        value: percentageIncome, // Use the calculated percentage
        max: 90, // Maximum value for the gauge
    };

    // const setting2 = {
    //     width: 200,
    //     height: 170,
    //     value: percentagebudjett,
    // };

    const setting2 = {
        width: 200,
        height: 170,
        value: percentagebudjett,
    };

    const setting4 = {
        width: 200,
        height: 170,
        value: percentageExpan,
    };


    return (
        <div>
            <div className='Dashboard'>
                <div className='filter'>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '19px' }}>

                        <TextField
                            label="Start Date"
                            name="startDate"
                            variant="standard"
                            fullWidth
                            type="date"
                            value={formData.startDate || ''}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChangeFormData}
                            style={{ width: '170px', marginTop: '7px', marginLeft: '20px' }}
                        />

                        <TextField
                            label="End Date"
                            name="endDate"
                            variant="standard"
                            fullWidth
                            type="date"
                            value={formData.endDate || ''}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChangeFormData}
                            style={{ width: '170px', marginTop: '7px', marginLeft: '20px' }}
                        />
                        {/* <a
                            onClick={handleView}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'blue',
                                textDecoration: 'none', // Remove underline
                            }}
                        >
                            View
                        </a>    <br></br> */}
                        <button onClick={handleView}>view</button>
                        <a
                            onClick={overall}

                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'blue',
                                textDecoration: 'none', // Remove underline
                            }}
                        >
                            Over All
                        </a>
                    </div>
                </div>

                <div style={{ backgroundColor: "rgb(88, 86, 214)", color: "white", width: '270px', marginLeft: '340px', marginTop: '-80px', borderRadius: "10px", padding: "30px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", fontFamily: '"Roboto", sans-serif', textAlign: "left" }} >
                    <p style={{ marginTop: '-29px' }}>Over All PoAmount <BiCoinStack size={32} style={{ color: "orange" }} />
                    </p>
                    <p style={{ marginTop: '10px' }}>{totalpoAmount}</p>
                </div>
                <div style={{ backgroundColor: "#f37654", color: "white", width: '270px', marginLeft: '630px', marginTop: '-99px', borderRadius: "10px", padding: "27px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center", fontFamily: "Arial, sans-serif", }} >
                    <p style={{ marginTop: '-29px' }}>Overall Expanse <AiFillCaretDown size={37} /></p>

                    <p style={{ marginTop: '10px' }}>{gettotalExpanse}</p>
                </div>
                <div style={{ backgroundColor: "#29bf71", color: "white", width: '270px', marginLeft: '930px', marginTop: '-97px', borderRadius: "10px", padding: "20px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center", fontFamily: "Arial, sans-serif", }} >
                    <p style={{ marginTop: '-19px' }}>Over income <AiFillCheckSquare size={37} />
                    </p>
                    <p style={{ marginTop: '10px' }}>{totalIncome}</p>
                </div>
                <div style={{ backgroundColor: "#335262", color: "white", width: '270px', marginLeft: '1210px', marginTop: '-92px', borderRadius: "10px", padding: "30px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center", fontFamily: "Arial, sans-serif", }} >
                    <p style={{ marginTop: '-29px' }}>Over all profit <MdTrendingUp size={32} style={{ color: "orange" }} />
                    </p>
                    <p style={{ marginTop: '10px' }}>{overallProfit}</p>
                </div>


                <div style={{ marginTop: '30px' }}>
                    <Line ></Line>
                </div>
                <div style={{ backgroundColor: "#274653", color: "white", width: '370px', marginLeft: '-10px', marginTop: '21px', borderRadius: "10px", padding: "170px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", fontFamily: '"Roboto", sans-serif', textAlign: "left" }} >
                    <p style={{ marginTop: '-29px' }}>Over all profit </p>

                </div>

                
                <div style={{ backgroundColor: "#274653", color: "white", width: '1070px', marginLeft: '370px', marginTop: '-390px', borderRadius: "10px", padding: "147px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center", fontFamily: "Arial, sans-serif", }} >
                    <div className="filterPro">
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '19px' }}>
                            {/* <TextField
                                label="Start Date"
                                name="startDate_formData1"
                                variant="standard"
                                fullWidth
                                type="date"
                                value={formData1.startDate || ""}
                                InputProps={{
                                    style: {
                                        color: "white", // Text color
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: {
                                        color: "white", // Label color
                                    },
                                }}
                                sx={{
                                    flexBasis: "23%",
                                    "& .MuiInput-underline:before": {
                                        borderBottomColor: "white", // Default underline color
                                    },
                                    "& .MuiInput-underline:hover:before": {
                                        borderBottomColor: "white", // Hover underline color
                                    },
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "white", // Active underline color
                                    },
                                    "& .MuiFormHelperText-root": {
                                        color: "white", // Helper text color
                                    },
                                }}
                                style={{
                                    width: "170px",
                                    marginTop: "7px",
                                    marginLeft: "20px",
                                }}
                                onChange={handleChangeFormData1}
                                error={Boolean(formErrors.startDate)}
                                helperText={formErrors.startDate}
                            />

                            <TextField
                                label="End Date"
                                name="endDate_formData1"
                                variant="standard"
                                fullWidth
                                type="date"
                                value={formData1.endDate || ""}
                                InputProps={{
                                    style: {
                                        color: "white", // Text color
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: {
                                        color: "white", // Label color
                                    },
                                }}
                                sx={{
                                    flexBasis: "23%",
                                    "& .MuiInput-underline:before": {
                                        borderBottomColor: "white", // Default underline color
                                    },
                                    "& .MuiInput-underline:hover:before": {
                                        borderBottomColor: "white", // Hover underline color
                                    },
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "white", // Active underline color
                                    },
                                    "& .MuiFormHelperText-root": {
                                        color: "white", // Helper text color
                                    },
                                }}
                                style={{
                                    width: "170px",
                                    marginTop: "7px",
                                    marginLeft: "20px",
                                }}
                                onChange={handleChangeFormData1}
                                error={Boolean(formErrors.endDate)}
                                helperText={formErrors.endDate}
                            /> */}

                            <TextField
                                select // This will turn the TextField into a Select dropdown
                                label="Project No"
                                name="projectNo"
                                variant="standard"
                                fullWidth
                                value={formData1.projectNo || ""}
                                InputProps={{
                                    style: {
                                        color: "orange", // Text color
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: {
                                        color: "orange", // Label color
                                    },
                                }}
                                sx={{
                                    flexBasis: "23%",
                                    "& .MuiInput-underline:before": {
                                        borderBottomColor: "orange", // Default underline color
                                    },
                                    "& .MuiInput-underline:hover:before": {
                                        borderBottomColor: "orange", // Hover underline color
                                    },
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "orange", // Active underline color
                                    },
                                    "& .MuiFormHelperText-root": {
                                        color: "orange", // Helper text color
                                    },
                                }}
                                style={{
                                    width: "170px",
                                    marginTop: "7px",
                                    marginLeft: "20px",
                                }}
                                onChange={handleChangeFormData1}
                                error={Boolean(formErrors.projectNo)}
                                helperText={formErrors.projectNo}
                            >
                                {getProjectNo.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}


                            </TextField>

                            <a
                                onClick={getProjectwiseAccountDetail}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none', // Remove underline
                                }}
                            >
                                View
                            </a>     <br></br>
                            <a
                                href="https://react.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none', // Remove underline
                                }}
                            >
                                Over All
                            </a>
                        </div>
                    </div>
                </div>
                <div className='Overallpo'>

                    <Gauge
                        {...settings}
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 21,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: '#52b202',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                            },
                        })}
                    />
                    <p style={{ marginLeft: '-340px' }}>PoAmount</p>
                </div>
                <div className='Overallpo1'>

                    <Gauge
                        {...setting1}
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 21,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: '#52b202',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                            },
                        })}
                    />
                    <div style={{ textAlign: "center", marginLeft: "-310px" }}>
                        <p>Income: {totalIncome1}</p>
                        <p>
                            Difference: {differenceAmount} ({percentageIncome.toFixed(2)}%)
                        </p>
                    </div>

                </div>
                <div className='Overallpo2'>
                    <h4 style={{ marginTop: '-70px', marginLeft: '-70px', fontSize: '19px', width: '57%', textAlign: 'left' }}>
                    </h4>
                    <Gauge
                        {...setting2}
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 21,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: '#52b202',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                            },
                        })}
                    />
                    <div style={{ textAlign: "center", marginLeft: "-310px" }}>
                        <p>Budjet: {totalbudject}</p>

                    </div>
                </div>
                <div className='Overallpo3'>
                    <h4 style={{ marginTop: '-70px', marginLeft: '-190px', fontSize: '19px', width: '57%', textAlign: 'left' }}>
                    </h4>
                    <Gauge
                        {...setting3}
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 21,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: gaugeColor
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                            },
                        })}
                    />
                    <div style={{ textAlign: "center", marginLeft: "-310px" }}>
                        <p>Expanse: {totalExpanse1}</p>

                    </div>
                </div>

                <div className='Overallpo4'>
                    <h4 style={{ marginTop: '-70px', marginLeft: '-190px', fontSize: '19px', width: '57%', textAlign: 'left' }}>
                    </h4>
                    <Gauge
                        {...setting4}
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 21,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: 'Blue'
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                            },
                        })}
                    />
                    <div style={{ textAlign: "center", marginLeft: "-310px" }}>
                        <p>Avilable BudjectAmout: {totalbudject - totalExpanse1}</p>

                    </div>
                </div>
                <div style={{ width: "37%", margin: "0 auto", marginTop: '135px', marginLeft: '770px' }}>
                    <h2 style={{ textAlign: "center", color: "white", fontFamily: '"Roboto", sans-serif' }}>Monthly Expenses</h2>
                    <Bar data={data} options={options}>
                        {renderChartData(data)}
                    </Bar>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 