import React, { useEffect, useState } from 'react';
import './FinanceDashBoard.css';
import { getAccountDeatil } from '../Services/Services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faIndianRupeeSign, faLandmark, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { BarChart } from '@mui/x-charts/BarChart';
import { AutoAwesome } from '@mui/icons-material';
import Chart from "chart.js/auto";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AgCharts } from 'ag-charts-community';
import GaugeChart from "react-gauge-chart";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, LinearProgress, } from "@mui/material";

import { PieController, ScatterController } from 'chart.js';
Chart.register(PieController, ScatterController);

const FinanceDashboard = () => {
    const name = "React";
    const [getAccountDetail, setGetAccountDetail] = useState([]);
    const [filteredDetails, setFilteredDetails] = useState([]);

    const [totalpoAmount, setTotalpoAmount] = useState(0);
    const [gettotalExpanse, setTotalExpanse] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [overallProfit, setOverallProfit] = useState(0);
    const [poAmountDetail, setPoAmountDetail] = useState([]);
    const [bankBalance, setBankBalance] = useState(0);
    const [outstanding, setOutstanding] = useState(0);

    const [emi, setEmi] = useState(0);
    const [outStandingAmount, setOutstandingAmount] = useState(0);
    const [plannedBudget, setPlannedBudget] = useState({});
    const [expanseBudget, setExpanseBudget] = useState({});
    const [quarterlyCreditTotals, setQuarterlyCreditTotals] = useState({});
    const [totalGrossProfit, setTotalGrossProfit] = useState();
    const [TotalProfitabilityPercentage, setTotalProfitabilityPercentage] = useState();
    const [totalNetProfitabilityPercentage, setTotalNetProfitabilityPercentage] = useState();
    const [TotalNetProfit, setTotalNetProfit] = useState();
    const [monthlyIncome, setMonthlyIncome] = useState([]);
    const [selectedValue, setSelectedValue] = useState("$0");
    const [selectedRevenue, setSelectedRevenue] = useState("$0");
    const [expanse, setExpances] = useState(0);
    const [overheads, setOverheads] = useState(0);
    const [purchase, setPurchase] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [isNetVisible, setNetVisible] = useState(false);
    const [isMonthlyChartVisibl, setMonthlyChartVisibl] = useState(false);
    const [isGrossVisible, setGrossVisible] = useState(false);
    const [netProfitProjectwise, setNetProfitProjectwise] = useState({})
    const [grossProfitProjectwise, setGrossProfitProjectwise] = useState({})
    const [eachMomthExpanse,setEachMomthExpanse] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;
    const [selectedYear, setSelectedYear] = useState('ALL');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const financialYears = ['ALL', '2022-2023', '2023-2024', '2024-2025'];
    const chartRef = React.useRef(null);

    const toggleNetPopup = () => {
        setNetVisible(!isNetVisible);
    };
    const toggleGrossPopup = () => {
        setGrossVisible(!isGrossVisible);
    };
    const toggleMonthlyChartPopup = () => {
        setMonthlyChartVisibl(!isMonthlyChartVisibl);
    };
    const clocePopup = () => {
        setNetVisible(false);
        setGrossVisible(false)
        setMonthlyChartVisibl(false)
    }
    useEffect(() => {
        getAccountDea();
    }, []);

    const getAccountDea = () => {
        getAccountDeatil()
            .then((response) => {
                const data = Array.isArray(response.data) ? response.data : [];
                setGetAccountDetail(data);
            })
            .catch((error) => {
                console.error('Error fetching account details:', error);
            });
    };

    useEffect(() => {
        if (getAccountDetail.length === 0) return;
        calculateOverall(getAccountDetail);
    }, [getAccountDetail, startDate, endDate]);
    //Curency formate
    const calculateOverall = (accountDetails) => {
        const formatter = new Intl.NumberFormat('en-IN', {
            currency: 'INR',
            maximumFractionDigits: 0,
        });

        const filteredAccountDetails = accountDetails.filter((account) => {
            const transactionDate = parseDate(account.date);
            console.log("Transaction Date Value:", account.date);

            if (!transactionDate) return false;

            if (startDate && endDate) {
                return transactionDate >= startDate && transactionDate <= endDate;
            }
            return true;
        });
        //overallpoAmount
        const overallpoAmount = filteredAccountDetails
            .filter((account) => account.po_Amount)
            .reduce((sum, account) => sum + (account.po_Amount || 0), 0);
        setTotalpoAmount(formatter.format(overallpoAmount));
        //totalExpanse
        const totalExpanse = filteredAccountDetails
            .filter((account) => account.debit_Amount)
            .reduce((sum, account) => sum + (account.debit_Amount || 0), 0);
        setTotalExpanse(formatter.format(totalExpanse));
        //overtotalIncome
        const totalIncome = filteredAccountDetails
            .filter((account) => account.credit_Amount)
            .reduce((sum, account) => sum + (account.credit_Amount || 0), 0);
        setTotalIncome(formatter.format(totalIncome));
        //overallProfit
        const profit = overallpoAmount - totalExpanse + totalIncome;
        setOverallProfit(formatter.format(profit));
        // Bank balance
        const Bank = filteredAccountDetails
            .map((account) => account.bankBalance); // Extract the bankBalance values
        setBankBalance(Bank);
        console.log("bankbalance", bankBalance)
         // emi balance
         const emi = filteredAccountDetails
         .map((account) => account.emi); // Extract the bankBalance values
     setEmi(emi);
     console.log("emi", emi)
     // emi balance
     const outstandingAmo = filteredAccountDetails
     .map((account) => account.outstandingAmount); // Extract the bankBalance values
     setOutstanding(outstandingAmo);
 console.log("outstanding", emi)
        //outstanding
        const Outstanding = filteredAccountDetails
            .filter(
                (account) =>
                    account.projectNo?.startsWith('PRN') && account.po_Amount && account.credit_Amount
            )
            .reduce((sum, account) => sum + (account.po_Amount - account.credit_Amount || 0), 0);
        setOutstandingAmount(Outstanding);
        console.log("setOutstandingAmount",outStandingAmount)
        // Calculate the planned budget per project
        const plannedBudgetSum = filteredAccountDetails.reduce((acc, account) => {
            if (account.projectNo && account.projectNo.startsWith('PRN')) {
                const projectNo = account.projectNo;
                const projectName = account.projectName;
                const plannedBudget = account.planedBudjet || 0; // Assuming `planedBudjet` is the planned budget amount
                if (!acc[projectNo]) {
                    acc[projectNo] = { projectName, plannedBudget };
                } else {
                    acc[projectNo].plannedBudget += plannedBudget;
                }
            }
            return acc;
        }, {});
        setPlannedBudget(plannedBudgetSum)
        const expanseBudgetSum = filteredAccountDetails.reduce((acc, account) => {
            if (account.projectNo && account.projectNo.startsWith('PRN')) {
                const projectNo = account.projectNo;
                const projectName = account.projectName;
                const debitAmount = account.debit_Amount || 0; // Assuming `debit_Amount` is the expense amount
                if (!acc[projectNo]) {
                    acc[projectNo] = { projectName, totalDebit: 0 };
                }
                acc[projectNo].totalDebit += debitAmount;
            }
            return acc;
        }, {});
        setExpanseBudget(expanseBudgetSum)
        // Quarterly Credit Amount Calculation
        const quarters = {
            Q1: [1, 2, 3],   // Jan, Feb, Mar
            Q2: [4, 5, 6],   // Apr, May, Jun
            Q3: [7, 8, 9],   // Jul, Aug, Sep
            Q4: [10, 11, 12] // Oct, Nov, Dec
        };

        const quarterlyCreditAmounts = Object.entries(quarters).reduce((acc, [quarter, months]) => {
            acc[quarter] = filteredAccountDetails
                .filter(
                    (account) =>
                        account.projectNo?.startsWith('PRN') &&
                        months.includes(parseDate(account.date)?.getMonth() + 1) &&
                        account.credit_Amount
                )
                .reduce((sum, account) => sum + (account.credit_Amount || 0), 0);
            return acc;
        }, {});
        console.log("Quarterly Credit Amounts:", quarterlyCreditAmounts);
        setQuarterlyCreditTotals(quarterlyCreditAmounts);
        //GrossProfit 
        const GrossProfit = filteredAccountDetails.reduce((acc, account) => {
            if (account.projectNo && account.projectNo.startsWith('PRN')) {
                const projectNo = account.projectNo;
                const projectName = account.projectName || "Unknown Project"; // Default project name if missing
                // Initialize project data if not already present
                acc[projectNo] = acc[projectNo] || {
                    projectName: projectName,
                    poAmount: 0,
                    expenses: 0,
                    purchases: 0,
                };
                acc[projectNo].projectName = projectName;
                acc[projectNo].poAmount += account.po_Amount || 0;
                if (account.catagery === 'Expenses') {
                    acc[projectNo].expenses += account.debit_Amount || 0;
                }
                if (account.catagery === 'purchases') {
                    acc[projectNo].purchases += account.debit_Amount || 0;
                }
            }
            return acc;
        }, {});

        // Calculate Gross Profit and Profitability Percentage for each project
        for (let projectNo in GrossProfit) {
            const projectData = GrossProfit[projectNo];
            projectData.grossProfit = projectData.poAmount - projectData.expenses - projectData.purchases;
            projectData.profitabilityPercentage = (projectData.grossProfit / projectData.poAmount) * 100 || 0; // Calculate profitability as a percentage
        }
        // Calculate the total gross profit
        const totalGrossProfit = Object.values(GrossProfit).reduce(
            (total, projectData) => total + projectData.grossProfit,
            0
        );
        // Calculate total PO Amount (sum of all PO amounts)
        const totalPoAmount = Object.values(GrossProfit).reduce(
            (total, projectData) => total + projectData.poAmount,
            0
        );
        
        // Log values to inspect the result
        console.log("Total Gross Profit: ", totalGrossProfit);
        console.log("Total PO Amount: ", totalPoAmount);
        // Calculate the total profitability percentage
        let totalProfitabilityPercentage = 0;
        if (totalPoAmount > 0) {
            totalProfitabilityPercentage = (totalGrossProfit / totalPoAmount) * 100;
        } else {
            console.log("Warning: Total PO Amount is zero or negative!");
            totalProfitabilityPercentage = 0; // Or handle accordingly
        }
        totalProfitabilityPercentage = Math.round(totalProfitabilityPercentage);
        console.log("Total Profitability Percentage: ", totalProfitabilityPercentage);
        setTotalGrossProfit(formatter.format(totalGrossProfit));
        setTotalProfitabilityPercentage(totalProfitabilityPercentage.toFixed(2));

        // Reduce the data to calculate Net Profit for each project
        const NetProfit = getAccountDetail.reduce((acc, account) => {
            if (account.projectNo && account.projectNo.startsWith('PRN')) {
                const projectNo = account.projectNo;
                const projectName = account.projectName || "Unknown Project";
                acc[projectNo] = acc[projectNo] || {
                    projectName: projectName,
                    poAmount: 0,
                    expenses: 0,
                };

                // Update project name (if different) and add amounts
                acc[projectNo].projectName = projectName;
                acc[projectNo].poAmount += account.po_Amount || 0;

                if (account.catagery === 'Overheads') {
                    acc[projectNo].expenses += account.debit_Amount || 0;
                }
            }
            return acc;
        }, {});

        // Calculate Net Profit and Profitability Percentage for each project
        let totalNetProfit = 0;
        let totalPoAmount1 = 0;

        for (let projectNo in NetProfit) {
            const projectData = NetProfit[projectNo];
            projectData.netProfit = projectData.poAmount - projectData.expenses;
            projectData.netProfitabilityPercentage =
                projectData.poAmount > 0 ? (projectData.netProfit / projectData.poAmount) * 100 : 0;
            // Sum up totals
            totalNetProfit += projectData.netProfit;
            totalPoAmount1 += projectData.poAmount;
        }
        // Calculate the Total Net Profitability Percentage
        let totalNetProfitabilityPercentage = 0;
        if (totalPoAmount1 > 0) {
            totalNetProfitabilityPercentage = (totalNetProfit / totalPoAmount1) * 100;
        }
        // Log the totals
        console.log("Total Net Profit: ", totalNetProfit);
        console.log("Total PO Amount: ", totalPoAmount1);
        console.log("Total Net Profitability Percentage: ", totalNetProfitabilityPercentage.toFixed(2));
        // Update state with the totals
        setTotalNetProfit(formatter.format(totalNetProfit)); // Format for display, e.g., $123,456
        setTotalNetProfitabilityPercentage(totalNetProfitabilityPercentage.toFixed(2));

        console.log("GrossProfit", GrossProfit);
        console.log('plannedBudgetSum', plannedBudgetSum)
        console.log('expanseBudgetSum', expanseBudgetSum)
        console.log("totalGrossProfit", totalGrossProfit)
        console.log("plannedBudget", plannedBudget);
        console.log("expanseBudget", expanseBudget)

        // Monthly income sum
        const monthlyIncomeDetail = filteredAccountDetails.reduce((acc, item) => {
            const date = item?.date;
            const income = item?.credit_Amount || 0;
            if (!date) {
                console.warn("Item missing 'date':", item);
                return acc;
            }
            const month = date.split('-')[1];
            if (!acc[month]) {
                acc[month] = { month, totalIncome: 0 };
            }
            acc[month].totalIncome += income;
            return acc;
        }, {});
        // Ensure all 12 months are displayed
        const allMonths = [
            "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
        ];

        // Fill in missing months with 0 income if not present
        const filledMonthlyRevenue = allMonths.map(month => {
            if (monthlyIncomeDetail[month]) {
                return monthlyIncomeDetail[month];
            } else {
                return { month, totalIncome: 0 };
            }
        });

        // Convert the filled object to an array for rendering or further processing
        const result = filledMonthlyRevenue.map(item => ({
            month: item.month,
            totalIncome: item.totalIncome,
        }));
        setMonthlyIncome(result)
        console.log("Result", result)

        //monthlyRevenue
        const monthlyRevenueDetail = filteredAccountDetails.reduce((acc, item) => {
            const date = item?.date;
            const income = item?.po_Amount || 0;
            if (!date) {
                console.warn("Item missing 'date':", item);
                return acc;
            }
            const month = date.split('-')[1]; // Split by "-" and get the month part (e.g., "03" for March)
            if (!acc[month]) {
                acc[month] = { month, totalIncome: 0 };
            }
            acc[month].totalIncome += income;
            return acc;
        }, {});

        const filledMonthlyIncome = allMonths.map(month => {
            if (monthlyRevenueDetail[month]) {
                return monthlyRevenueDetail[month];
            } else {
                return { month, totalIncome: 0 };
            }
        });

        const revenueResult = filledMonthlyIncome.map(item => ({
            month: item.month,
            totalIncome: item.totalIncome,
        }));
        console.log("revenueResult", revenueResult)

        setMonthlyRevenue(revenueResult);
        console.log("montlyrevenue", monthlyRevenue)

        // Category-wise totals calculation
        const totalExpensesCategory = filteredAccountDetails.reduce(
            (sum, account) => sum + (account.catagery === 'Expenses' ? account.debit_Amount || 0 : 0),
            0
        );
        const totalPurchaseCategory = filteredAccountDetails.reduce(
            (sum, account) => sum + (account.catagery === 'Purchases' ? account.debit_Amount || 0 : 0),
            0
        );
        const totalOverheadsCategory = filteredAccountDetails.reduce(
            (sum, account) => sum + (account.catagery === 'Overheads' ? account.debit_Amount || 0 : 0),
            0
        );
        setExpances(totalExpensesCategory);
        setOverheads(totalOverheadsCategory);
        setPurchase(totalPurchaseCategory);
        console.log("setExpances", expanse)
        console.log("setOverheads", overheads)
        console.log("setPurchase", totalPurchaseCategory)
        //NetProfitProjectwise and persenateg
        const NetProfitProjectwise = filteredAccountDetails.reduce((acc, account) => {
            if (account.projectNo && account.projectNo.startsWith('PRN')) {
                const projectNo = account.projectNo;
                const projectName = account.projectName || "Unknown Project"; // Default project name if missing
                acc[projectNo] = acc[projectNo] || {
                    projectName: projectName,
                    poAmount: 0,
                    expenses: 0,
                };
                acc[projectNo].projectName = projectName;
                acc[projectNo].poAmount += account.po_Amount || 0;

                if (account.catagery === 'Overheads') {
                    acc[projectNo].expenses += account.debit_Amount || 0;
                }
            }
            return acc;
        }, {});
        // Calculate Net profit and profitability percentage for each project
        for (let projectNo in NetProfitProjectwise) {
            const projectData = NetProfitProjectwise[projectNo];
            projectData.grossProfit = projectData.poAmount - projectData.expenses;
            projectData.profitabilityPercentage =
                projectData.poAmount > 0 ? (projectData.grossProfit / projectData.poAmount) * 100 : 0;
        }
        setNetProfitProjectwise(NetProfitProjectwise)
        // console.log("NetProfit",NetProfit);
        console.log("NetProfitProjectwise", NetProfitProjectwise)

        //grossProfitProjectwise
        const grossProfitProjectwise = filteredAccountDetails.reduce((acc, account) => {
            if (account.projectNo && account.projectNo.startsWith('PRN')) {
                const projectNo = account.projectNo;
                const projectName = account.projectName || "Unknown Project"; // Default project name if missing
                acc[projectNo] = acc[projectNo] || {
                    projectName: projectName,
                    poAmount: 0,
                    expenses: 0,
                    purchases: 0,
                };
                acc[projectNo].projectName = projectName;
                acc[projectNo].poAmount += account.po_Amount || 0;
                if (account.catagery === 'Expenses') {
                    acc[projectNo].expenses += account.debit_Amount || 0;
                }
                if (account.catagery === 'purchases') {
                    acc[projectNo].purchases += account.debit_Amount || 0;
                }
            }
            return acc;
        }, {});
        for (let projectNo in grossProfitProjectwise) {
            const projectData = grossProfitProjectwise[projectNo];
            projectData.grossProfit = projectData.poAmount - projectData.expenses - projectData.purchases;
            projectData.profitabilityPercentage = (projectData.grossProfit / projectData.poAmount) * 100 || 0; // Calculate profitability as a percentage
        }
        setGrossProfitProjectwise(grossProfitProjectwise)
        //eachMonthlyExpance
        const eachMonthlyExpance = accountDetails.reduce((acc, account) => {
            const date = new Date(account.date); 
            if (!isNaN(date)) { 
                const month = date.getMonth() + 1; // Get month (1-12)
                if (!acc[month]) {
                    acc[month] = 0; 
                }
                acc[month] += account.debit_Amount || 0; // Add debit amount, default to 0
            } 
            return acc;
        }, {});
    
        // Convert the object to an array
        const monthlyExpenseArray = Object.entries(eachMonthlyExpance).map(([month, total]) => ({
            month: parseInt(month), // Ensure month is a number
            total: total || 0, // Ensure total is valid
        }));
    
        // Update the state
        setEachMomthExpanse(monthlyExpenseArray);
        console.log("eachMonthlyExpance",monthlyExpenseArray)



        const TotalplanedBudject = filteredAccountDetails.reduce((acc, account) => {
            if (account.projectNo && account.projectNo.startsWith('PRN')) {
                const projectNo = account.projectNo;
                const projectName = account.projectName || "Unknown Project"; 
                acc[projectNo] = acc[projectNo] || {
                    projectName: projectName,
                    planedBudjet: 0,
                    po_Amount: 0,
                    PlannedBudgetPercentage: 0
                };
                acc[projectNo].planedBudjet += account.planedBudjet || 0; 
                acc[projectNo].po_Amount += account.po_Amount || 0; 
            }
            return acc;
        }, {});
        Object.keys(TotalplanedBudject).forEach(projectNo => {
            const project = TotalplanedBudject[projectNo];
            if (project.po_Amount > 0) {
                project.PlannedBudgetPercentage = ((project.planedBudjet / project.po_Amount) * 100).toFixed(2);
            }
        });
        const projectBudgetArray = Object.entries(TotalplanedBudject).map(([projectNo, data]) => ({
            projectNo,
            ...data
        }));
        console.log("projectBudgetArray",projectBudgetArray);



        const TotalPlanedBudget = filteredAccountDetails.reduce((acc, account) => {
            if (account.projectNo && account.projectNo.startsWith('PRN')) {
                const projectNo = account.projectNo;
                const projectName = account.projectName || "Unknown Project";
                acc[projectNo] = acc[projectNo] || {
                    projectName: projectName,
                    debit_Amount: 0, 
                    planedBudjet: 0,  
                    expancePercentage: 0, 
                };
                acc[projectNo].debit_Amount += account.debit_Amount || 0; 
                acc[projectNo].planedBudjet += account.planedBudjet || 0; 
            }
            return acc;
        }, {});
        Object.keys(TotalPlanedBudget).forEach(projectNo => {
            const project = TotalPlanedBudget[projectNo];
            if (project.planedBudjet > 0) { 
                project.expancePercentage = ((project.debit_Amount / project.planedBudjet) * 100).toFixed(2);
            }
        });
        const projectExpenseArray = Object.entries(TotalPlanedBudget).map(([projectNo, data]) => ({
            projectNo,
            ...data
        }));
        console.log("projectExpenseArray",projectExpenseArray)
    }; // -------------

    // Filter in tabel value
    const netProfitProjectObject = Object.keys(netProfitProjectwise).map(projectNo => ({
        project: projectNo,
        projectName: netProfitProjectwise[projectNo].projectName,
        profitability: netProfitProjectwise[projectNo].profitabilityPercentage.toFixed(2),
        netProfit: netProfitProjectwise[projectNo].grossProfit.toFixed(2),
    }));


    const grossProfitProjectObject = Object.keys(grossProfitProjectwise).map(projectNo => ({
        project: projectNo,
        projectName: grossProfitProjectwise[projectNo].projectName,
        profitability: grossProfitProjectwise[projectNo].profitabilityPercentage.toFixed(2),
        netProfit: grossProfitProjectwise[projectNo].grossProfit.toFixed(2),
    }));
    const [page, setPage] = useState(0);
    const rowsPerPage9 = 5;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    
    };
    const projectBudgets = Object.entries(plannedBudget).reduce((result, [projectNo, plannedData]) => {
        const expenseData = expanseBudget[projectNo] || { totalDebit: 0 };
        const expensePercentage =
            plannedData.plannedBudget > 0
                ? (expenseData.totalDebit / plannedData.plannedBudget) * 100
                : 0;
        result[projectNo] = {
            projectName: plannedData.projectName,
            plannedBudget: plannedData.plannedBudget,
            totalDebit: expenseData.totalDebit,
            expensePercentage: expensePercentage.toFixed(2) + '%'
        };
        return result;
    }, {});
    console.log("projectBudgets", projectBudgets);

    //dateMatch
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`);
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);

        if (year === 'ALL') {
            setStartDate(null);
            setEndDate(null);
        } else if (year === '2022-2023') {
            setStartDate(new Date('2022-04-01'));
            setEndDate(new Date('2023-03-31'));
        } else if (year === '2023-2024') {
            setStartDate(new Date('2023-04-01'));
            setEndDate(new Date('2024-03-31'));
        } else if (year === '2024-2025') {
            setStartDate(new Date('2024-04-01'));
            setEndDate(new Date('2025-03-31'));
        }
    };
    ///////////////////////////////

    //////------------------------------------------/////////////////

    useEffect(() => {
        if (!quarterlyCreditTotals) return;

        const ctx = chartRef.current.getContext("2d");

        // Destroy existing chart instance to prevent duplicate rendering
        if (Chart.getChart(ctx)) {
            Chart.getChart(ctx).destroy();
        }

        // Prepare chart data
        const labels = Object.keys(quarterlyCreditTotals); // ['Q1', 'Q2', 'Q3', 'Q4']
        const data = Object.values(quarterlyCreditTotals); // [amount for Q1, Q2, Q3, Q4]

        // Create the chart
        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Quarterly Credit Amount (INR)",
                        data,
                        backgroundColor: ["blue", "blue", "blue", "blue"],
                        borderColor: "#000",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                        labels: {
                            font: {
                                family: "Arial", // Custom font for legend
                                size: 14,
                            },
                        },
                    },
                    tooltip: {
                        enabled: true,
                    },
                    datalabels: {
                        // Plugin to show values inside the bars
                        color: "white", // White text for values
                        font: {
                            weight: "bold",
                            size: 12,
                        },
                        anchor: "center",
                        align: "center",
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Quarters",
                            color: "green", // Title color for X-axis
                            font: {
                                family: "Roboto, sans-serif",
                                weight: "bold",
                                size: 13,
                            },
                        },

                        ticks: {
                            font: {
                                family: "Courier New", // Custom font for labels (Q1, Q2, etc.)
                                size: 14,
                                family: "Roboto, sans-serif",
                            },
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Amount (INR)",
                            color: "green", // Title color for Y-axis
                            font: {
                                family: "Roboto, sans-serif",
                                weight: "bold",
                                size: 13,
                            },
                        },
                        ticks: {
                            font: {
                                family: "Roboto, sans-serif",
                                size: 14,
                            },
                        },
                        beginAtZero: true,
                    },
                },
            },
        });
    }, [quarterlyCreditTotals]);

    //monthly chart
    //MonthlyIncome Deail chart
    const data1 = {
        labels: monthlyIncome.map((item) => item.month), // Use all months
        datasets: [
            {
                label: "Revenue",
                data: monthlyIncome.map((item) => item.totalIncome), // Use total income
                data: monthlyIncome.map((item) => item.totalIncome), // Use total income
                backgroundColor: "rgb(122, 134, 244)", // Light blue for all bars
                hoverBackgroundColor: "green", // Darker blue on hover
                borderRadius: 5, // Rounded bar edges
                barThickness: 35,
            },
        ],
        
    };

    const options1 = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide legend
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month",
                    color: "green", // Title color for X-axis
                    font: {
                        family: "Roboto, sans-serif",
                        weight: "bold",
                        size: 13,
                    },
                },
                grid: {
                    display: false, // Remove gridlines
                },

            },
            y: {
                title: {
                    display: true,
                    text: "Amount (INR)",
                    color: "green", // Title color for Y-axis
                    font: {
                        family: "Roboto, sans-serif",
                        weight: "bold",
                        size: 13,
                    },
                },
                grid: {
                    drawBorder: false,
                    color: "#f0f0f0", // Light gridlines

                },
                ticks: {
                    callback: (value) => `${value.toLocaleString()}`,
                    size: 14,

                },
            },
        },
        plugins: {
            datalabels: {
                anchor: "end",
                align: "end",
                color: "#000",
                font: {
                    weight: "bold",
                },
                formatter: (value) => `${value.toLocaleString()}`, // Show value at top
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index; // Get index of clicked bar
                const value = monthlyIncome[index]?.totalIncome || 0;
                setSelectedValue(`${value.toLocaleString()}`);
            }
        },
    };
    //revenue Chart
    const revenueData = {
        labels: monthlyRevenue.map((item) => item.month), // Use all months
        datasets: [
            {
                label: "Revenue",
                data: monthlyRevenue.map((item) => item.totalIncome), // Use total income
                backgroundColor: "rgb(122, 134, 244)", // Light blue for all bars
                hoverBackgroundColor: "green", // Darker blue on hover
                borderRadius: 5, // Rounded bar edges
                barThickness: 35,
            },
        ],
    };
    const revenueOption = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide legend
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Po Month",
                    color: "green", // Title color for X-axis
                    font: {
                        family: "Roboto, sans-serif",
                        weight: "bold",
                        size: 13,
                    },
                },
                grid: {
                    display: false, // Remove gridlines
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Po Amount ",
                    color: "green", // Title color for Y-axis
                    font: {
                        family: "Roboto, sans-serif",
                        weight: "bold",
                        size: 13,
                    },
                },
                grid: {
                    drawBorder: false,
                    color: "#f0f0f0", // Light gridlines
                },
                ticks: {
                    callback: (value) => `${value.toLocaleString()}`,
                },
            },
        },
        plugins: {
            datalabels: {
                anchor: "end",
                align: "end",
                color: "#000",
                font: {
                    weight: "bold",
                },
                formatter: (value) => `${value.toLocaleString()}`, // Show value at top
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index; // Get index of clicked bar
                const value = monthlyRevenue[index]?.totalIncome || 0;
                setSelectedRevenue(`${value.toLocaleString()}`);
            }
        },
    };
    const donetData = {
        labels: ['Expenses', 'Purchases', 'Overheads'], // Dynamic labels
        datasets: [
            {
                data: [expanse, purchase, overheads], // Use state values for each category
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Segment colors
                hoverBackgroundColor: ['#FF4F70', '#1D86E6', '#F9B234'], // Colors on hover
                borderWidth: 2,
            },
        ],
    };

    const donetOpiton = {
        cutout: "30%", // Creates the doughnut shape
        plugins: {
            legend: {
                display: false, // Disable default legend, since we will create a custom legend
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "USD", // Change to "INR" for Indian Rupees
                        });
                        const label = tooltipItem.label;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };
    const handleClick = () => {
        console.log("uygeugruyer")
    }
    //eachMonthExpanceChart
    const monthchart = {
        labels: eachMomthExpanse.map((item) => item.month), // Use month numbers
        datasets: [
            {
                label: "Monthly Expenses",
                data: eachMomthExpanse.map((item) => item.total), // Use total expenses
                backgroundColor: "rgb(122, 134, 244)",
                hoverBackgroundColor: "green",
                borderRadius: 5,
                barThickness: 35,
            },
        ],
    };

    const monthoption = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide legend
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month",
                    color: "green", // Title color for X-axis
                    font: {
                        family: "Roboto, sans-serif",
                        weight: "bold",
                        size: 13,
                    },
                },
                grid: {
                    display: false, // Remove gridlines
                },

            },
            y: {
                title: {
                    display: true,
                    text: "Amount (INR)",
                    color: "green", // Title color for Y-axis
                    font: {
                        family: "Roboto, sans-serif",
                        weight: "bold",
                        size: 13,
                    },
                },
                grid: {
                    drawBorder: false,
                    color: "#f0f0f0", // Light gridlines

                },
                ticks: {
                    callback: (value) => `${value.toLocaleString()}`,
                    size: 14,

                },
            },
        },
        plugins: {
            datalabels: {
                anchor: "end",
                align: "end",
                color: "#000",
                font: {
                    weight: "bold",
                },
                formatter: (value) => `${value.toLocaleString()}`, // Show value at top
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index; // Get index of clicked bar
                const value = monthlyIncome[index]?.totalIncome || 0;
                setSelectedValue(`${value.toLocaleString()}`);
            }
        },
    };
    
    return (
        <div className='FinanceDashContainer'>
            <div className='financeDeatil'>
                <div className='totalPo'>
                    <p>Total Revenue <FontAwesomeIcon icon={faCoins} style={{ color: 'orange', fontSize: '19px' }} /></p>
                    <p>{totalpoAmount}</p>
                </div>
                <div className='totalIncome'>
                    <p>Total Income <FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: 'green', fontSize: '19px' }} /></p>
                    <p>{totalIncome}</p>
                </div>
                <div className='bankBalance'>
                    <p>Available Balance <FontAwesomeIcon icon={faLandmark} style={{ color: 'orange', fontSize: '19px' }} /></p>
                    <p>{bankBalance}</p>
                </div>
                <div className='monthlyEmi'>
                    <p style={{ color: 'black', fontFamily: 'Exo 2' }}>monthlyEmi <FontAwesomeIcon icon={faMoneyBill} style={{ color: 'red', fontSize: '19px' }} /></p>
                    <p style={{ fontWeight: '', color: 'black', fontFamily: 'Exo 2' }}>{emi}</p>
                </div>
                <div className='otstandingAmount'>
                    <p>Outstanding Amount <FontAwesomeIcon icon={faLandmark} style={{ color: 'orange', fontSize: '19px' }} /></p>
                    <p>{outstanding}</p>
                </div>
                <div className='financialYear'>
                    <label htmlFor="financialYear">Select Financial Year</label>
                    <select id="financialYear" value={selectedYear} onChange={handleYearChange}>
                        {financialYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='chartDashoard1'>
                <div className='flexbox' onClick={toggleNetPopup}>
                    <p>Net profit</p>
                    <GaugeChart
                        id="gauge-chart3"
                        nrOfLevels={3}
                        colors={["green", "orange", "red"]}
                        arcWidth={0.3}
                        percent={totalNetProfitabilityPercentage / 100}
                        textColor={"orange"}
                    />
                    <p>Net profit : {TotalNetProfit}</p>
                </div>
                <div className='projectwiseExpnce' onClick={toggleMonthlyChartPopup}>
                    <p style={{ marginTop: '-230px', marginleft: '50px' }}>Expance</p>
                    <div style={{ marginleft: '90px', width: '2000px', height: '150px', flex: 1, display: 'flex', justifyContent: 'left' }}>
                        <Doughnut data={donetData} options={donetOpiton} />
                    </div>
                    <div className='donetlegent'>
                        {donetData.labels.map((label, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '5px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        backgroundColor: donetData.datasets[0].backgroundColor[index],
                                        marginRight: '10px',
                                    }}
                                ></div>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='quaterExpance'>
                    <canvas ref={chartRef}></canvas>;
                </div>
                <div className='overallExpance'  onClick={toggleGrossPopup}>
                    <p>Gross profit</p>
                    <GaugeChart
                        id="gauge-chart3"
                        nrOfLevels={3}
                        colors={["green", "orange", "red"]}
                        arcWidth={0.3}
                        percent={TotalProfitabilityPercentage / 100}
                        textColor={"orange"}
                    />
                    <p>Gross profit : {totalGrossProfit}</p>
                </div>
            </div>
            <div className='monthlyincomechart'>
                <div className='monthlyincome'>
                    <p style={{ marginLeft: '470px' }}>Monthly Income:  {selectedValue}</p>

                    <Bar data={data1} options={options1} />
                </div>
                <div className='OtherDeatilchart'>
                    <p style={{ marginLeft: '470px' }}>Monthly Revenue:  {selectedRevenue}</p>
                    <Bar data={revenueData} options={revenueOption} />
                </div>
            </div>
            <div className="tableData">
                {isNetVisible && (
                    <div className='Netprofittable'>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Project No
                                        </TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Project Name
                                        </TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Profitability Percentage
                                        </TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Profitability in Value
                                        </TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Progress
                                        </TableCell>
                                        <CloseSharpIcon sx={{ color: "red", fontSize: 30 }} onClick={clocePopup} />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {netProfitProjectObject
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.project}</TableCell>
                                                <TableCell>{row.projectName}</TableCell>
                                                <TableCell>{row.profitability}%</TableCell>
                                                <TableCell>{row.netProfit}</TableCell>
                                                <TableCell>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={row.profitability}
                                                        style={{
                                                            width: "30%",
                                                            backgroundColor: "#E0E0E0",
                                                            color: "#4CAF50",
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={netProfitProjectObject.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[rowsPerPage]}
                            />
                        </TableContainer>

                    </div>
                )};

                {isGrossVisible && (
                    <div className='Netprofittable'>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead style={{ backgroundColor: "#4A148C" }}>
                                    <TableRow>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Project No
                                        </TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Project Name
                                        </TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Profitability Percentage
                                        </TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Profitability in Value
                                        </TableCell>
                                        <TableCell style={{ color: "white", fontWeight: "bold" }}>
                                            Progress
                                        </TableCell>
                                        <CloseSharpIcon sx={{ color: "red", fontSize: 30 }} onClick={clocePopup} />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {grossProfitProjectObject
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.project}</TableCell>
                                                <TableCell>{row.projectName}</TableCell>
                                                <TableCell>{row.profitability}%</TableCell>
                                                <TableCell>{row.netProfit}</TableCell>
                                                <TableCell>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={row.profitability}
                                                        style={{
                                                            width: "30%",
                                                            backgroundColor: "#E0E0E0",
                                                            color: "#4CAF50",
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={grossProfitProjectObject.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[rowsPerPage]}
                            />
                        </TableContainer>

                    </div>
                )};
                {isMonthlyChartVisibl && (
                <div className='monthlyIncomeeChart'>
                    <div style={{marginleft:'1700px'}}>
                 <CloseSharpIcon sx={{ color: "red", fontSize: 30 }} onClick={clocePopup} />
                 </div>
                    <p style={{ marginLeft: '470px' }}>Monthly Expance:  {selectedValue}</p>
                    <Bar data={monthchart} options={monthoption} />
                </div>
                
            )}
            </div>
            <div className='ProjectComaprision'>
                <div className=''>
                    
                </div>
            </div>

        </div>
    );
};

export default FinanceDashboard;
