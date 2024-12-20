import React, { useEffect, useState } from "react";
import './workout.css';
import { getAccountDeatil, getProjectMangement } from "../Services/Services";

import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';

import { AiFillCheckSquare } from "react-icons/ai";
import { AiFillCaretDown } from "react-icons/ai";
import { MdTrendingUp } from "react-icons/md";
import { BiCoinStack } from "react-icons/bi";
import { Bar } from "react-chartjs-2";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts/PieChart';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Workout = () => {
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
  const [getTotalPurchaseCategory, setGetTotalPurchaseCategory] = useState();
  const [getTotalFundInputCategory, setGeTtotalFundInputCategory] = useState();
  const [getTotalOverheadsCategory, setGetTotalOverheadsCategory] = useState();
  const [getTotalExpensesCategory, setGetTotalExpensesCategory] = useState();
  const categoriesToInclude = ["totalPurchaseCategory", "totalFundInputCategory", "totalOverheadsCategory", "totalExpensesCategory"];


  //formdata
  const handleChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeFormData1 = (e) => {
    const { name, value } = e.target;
    const fieldName = name.replace("_formData1", "");
    setFormData1((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.startDate) {
      alert("Start Date is required")
    }
    if (!formData.endDate) {
      alert("End Date is required")
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert("End Date must be after Start Date")
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
  const getData = () => {
    getProjectMangement()
      .then((response) => {
        setGetProject(response.data);
        console.log("uywge9yguygh", response.data);

      })
      .catch((error) => {
      });
  };

  //barchart
  useEffect(() => {
    const calculateMonthlyExpenses = () => {
      const monthlyData = {};
      const uniqueMonths = new Set();
      getAccountDetail.forEach((item) => {
        if (!item.date || !item.debit_Amount) {
          console.warn("Skipping invalid record:", item);
          return;
        }
        const formattedDate = convertToDateFormat(item.date);
        const date = new Date(formattedDate);
        if (isNaN(date)) {
          console.error("Invalid date format after conversion:", formattedDate);
          return;
        }

        // Extract month and year
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        const label = `${month} ${year}`;

        // Add label to uniqueMonths
        uniqueMonths.add(label);

        // Aggregate expenses for the month
        const key = `${year}-${date.getMonth() + 1}`; // Use 1-based month index
        monthlyData[key] = (monthlyData[key] || 0) + item.debit_Amount;
      });

      // Sort the unique months chronologically
      const sortedLabels = Array.from(uniqueMonths).sort((a, b) => {
        const dateA = new Date(`${a} 1`);
        const dateB = new Date(`${b} 1`);
        return dateA - dateB;
      });

      // Map the sorted labels to their corresponding expense totals
      const expenses = sortedLabels.map((label) => {
        const [month, year] = label.split(" ");
        const key = `${year}-${new Date(`${month} 1, ${year}`).getMonth() + 1}`;
        return monthlyData[key] || 0;
      });

      console.log("Sorted Labels:", sortedLabels);
      console.log("Monthly Expenses:", expenses);

      setDynamicLabels(sortedLabels);
      setMonthlyExpenses(expenses);
    };

    calculateMonthlyExpenses();
  }, [getAccountDetail]);
  //date convertion in barchart
  const convertToDateFormat = (ddmmyyyy) => {
    const [day, month, year] = ddmmyyyy.split("-");
    return `${year}-${month}-${day}`;
  };


  console.log("Sorted Labels:", dynamicLabels);
  console.log("Monthly Expenses:", monthlyExpenses);
  console.log("getData", getProject);

  //overall dashboard
  const overall = () => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

    // overallpoamount
    const overallpoAmount = getAccountDetail
      .filter(account => account.po_Amount)
      .map(account => account.po_Amount);
    const totalpoAmount = overallpoAmount.reduce((sum, amount) => sum + amount, 0);
    setTotalpoAmount(formatter.format(totalpoAmount));

    // overallexpanse
    const overallExpanse = getAccountDetail
      .filter(account => account.debit_Amount)
      .map(account => account.debit_Amount);
    const totalexpanse = overallExpanse.reduce((sum, amount) => sum + amount, 0);
    setTotalExpanse(formatter.format(totalexpanse)); // Format and set total
    console.log("Individual Expanse Amounts:", overallExpanse);
    console.log("Total Expanse Amount:", formatter.format(totalexpanse));

    // overallincome
    const overallIncome = getAccountDetail
      .filter(account => account.credit_Amount)
      .map(account => account.credit_Amount);
    const totalIncome = overallIncome.reduce((sum, amount) => sum + amount, 0);
    setTotalIncome(formatter.format(totalIncome)); // Format and set total
    console.log("Individual Income Amounts:", overallIncome);
    console.log("Total Income Amount:", formatter.format(totalIncome));

    // overall profit
    const profit = totalpoAmount - totalexpanse + totalIncome;
    setOverallProfit(formatter.format(profit)); // Format and set profit
    console.log("Overall Profit:", formatter.format(profit));
  };
  //overall dashboard filter option
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

    setFilteredData(filtered);

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
    if (!date || typeof date !== 'string') {
      console.error('Invalid date:', date);
      return null; // Handle invalid date input
    }
    const [day, month, year] = date.split("-"); // Split "DD-MM-YYYY"
    return `${year}-${month}-${day}`; // Return "YYYY-MM-DD"
  };

  //bar chart
  const data = {
    labels: dynamicLabels, // Use dynamically generated labels (e.g., months)
    datasets: [
      {
        label: "Expenses",
        data: monthlyExpenses, // Use calculated monthly expenses
        // Dynamically generate colors for each bar (12 months)
        backgroundColor: monthlyExpenses.map((_, index) => {
          const colors = [
            "#76FF03",  // January
            "#F50057",  // February
            "#536DFE",  // March
            "#E040FB", // April
            "#FFC400",  // May
            "#FFFF00",  // June
            "#00E676", // July
            "#8E24AA",  // August
            "rgba(255, 99, 132, 0.6)",  // September
            "rgba(75, 192, 192, 0.6)",  // October
            "rgba(153, 102, 255, 0.6)", // November
            "rgba(255, 159, 64, 0.6)"   // December
          ];
          return colors[index % colors.length]; // Cycle through the colors for 12 months
        }),
        borderColor: monthlyExpenses.map((_, index) => {
          const borderColors = [
            "rgba(231, 233, 237, 1)",  // January
            "rgba(231, 233, 237, 1)",  // February
            "rgba(231, 233, 237, 1)",  // March
            "rgba(231, 233, 237, 1)", // April
            "rgba(231, 233, 237, 1)",  // May
            "rgba(231, 233, 237, 1)",  // June
            "rgba(231, 233, 237, 1)", // July
            "rgba(231, 233, 237, 1)",  // August
            "rgba(231, 233, 237, 1)",  // September
            "rgba(231, 233, 237, 1)",  // October
            "rgba(231, 233, 237, 1)", // November
            "rgba(231, 233, 237, 1)"   // December
          ];
          return borderColors[index % borderColors.length]; // Cycle through the border colors for 12 months
        }),
        borderWidth: 3.7,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#1B5E20", // Set X-axis labels (e.g., months) to white
          font: {
            size: 14, // Adjust font size
            weight: "bold", // Make the text bold
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          height: '490px',
          color: "#1B5E20", // Change the side row (Y-axis values) to white
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


  //setGetProjectNo 
  useEffect(() => {
    const uniqueProjectNumbers = Array.from(
      new Set(
        getAccountDetail
          .filter(account => account.projectNo) // Ensure projectNo exists
          .map(account => account.projectNo) // Extract projectNo
      )
    ).map(projectNo => ({
      value: projectNo, // Unique identifier for value
      label: projectNo  // What is displayed in dropdown
    }));

    setGetProjectNo(uniqueProjectNumbers);
  }, [getAccountDetail]); // Updated dependency

  console.log("formdata", formData1)


  //circle dashboard
  const getProjectwiseAccountDetail = () => {

    const startDate = formData1.startDate ? new Date(formData1.startDate) : null;
    const endDate = formData1.endDate ? new Date(formData1.endDate) : null;
    const projectNo = formData1.projectNo;

    // Normalize dates if provided
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    // Filter data
    const filtered = getAccountDetail.filter((item) => {
      const itemDateStr = convertDateFormat(item.date);
      const itemDate = new Date(itemDateStr);

      if (isNaN(itemDate.getTime())) {
        console.error("Invalid date in item:", item.date);
        return false;
      }

      itemDate.setHours(0, 0, 0, 0);

      // Apply filtering logic
      if (startDate && endDate && projectNo) {
        return (
          (item.projectNo === projectNo || item.referenceProjectNo === projectNo) &&
          itemDate >= startDate &&
          itemDate <= endDate
        );
      } else if (projectNo) {
        return item.projectNo === projectNo || item.referenceProjectNo === projectNo;
      } else {
        return true; // No filters applied
      }
    });

    if (filtered.length === 0) {
      setFilteredData1([]);  // Clear data if no match
      return;
    }

    setFilteredData1(filtered);  // Set filtered data

    // Calculate totals
    const totalPO1 = filtered.reduce((sum, account) => sum + (account.po_Amount || 0), 0);
    const totalExp1 = filtered.reduce(
      (sum, account) => sum + (account.amountSpent || 0) + (account.debit_Amount || 0),
      0
    ); const totalInc1 = filtered.reduce((sum, account) => sum + (account.credit_Amount || 0), 0);
    const totalBudget = filtered.reduce((sum, account) => sum + (account.planedBudjet || 0), 0);
    const totalAmount = filtered.reduce((sum, account) => sum + (account.amountSpent || 0), 0);
    const categoriesToInclude = ["totalPurchaseCategory", "totalFundInputCategory", "totalOverheadsCategory", "totalExpensesCategory"];
    console.log("filter", filtered.map((account) => account.catagery));
    const totalExpensesCategory = filtered.reduce((sum, account) => sum + (account.catagery === "Expenses" ? account.debit_Amount || 0 : 0), 0);
    const totalPurchaseCategory = filtered.reduce((sum, account) => sum + (account.catagery === "Purchases" ? account.debit_Amount || 0 : 0), 0);
    const totalFundInputCategory = filtered.reduce((sum, account) => sum + (account.catagery === "Fund Input" ? account.debit_Amount || 0 : 0), 0);
    const totalOverheadsCategory = filtered.reduce((sum, account) => sum + (account.catagery === "Overheads" ? account.debit_Amount || 0 : 0), 0);

    if (projectNo && projectNo.toLowerCase() !== "grn" && projectNo.toLowerCase() !== "sidco") {
      // Normal case: Update all values
      setTotalpoAmount1(totalPO1 || totalPO1 === 0 ? totalPO1 : 0);
      setTotalExpanse1(totalExp1);
      setTotalIncome1(totalInc1);
      setTotalBudject(totalBudget);
      setGetTotalExpensesCategory(totalExpensesCategory);
      setGetTotalOverheadsCategory(totalOverheadsCategory);
      setGetTotalPurchaseCategory(totalPurchaseCategory);
      setGeTtotalFundInputCategory(totalFundInputCategory);


      const overallProfit = totalPO1 - totalExp1 + totalInc1;
      setOverallProfit1(overallProfit);
    } else if (projectNo && !projectNo.toLowerCase().startsWith("prn")) {
      // Special case for GRN or SIDCO: Update only totalExpanse1
      setTotalExpanse1(totalExp1);
      setTotalpoAmount1(totalPO1 || totalPO1 === 0 ? totalPO1 : 0);  // Keep PO as 0 if it's missing
      setTotalIncome1(totalInc1);
      const budget = 0;  // Set budget to 0 if not available
      setTotalBudject(budget);
      setGetTotalExpensesCategory(totalExpensesCategory);
      setGetTotalOverheadsCategory(totalOverheadsCategory);
      setGetTotalPurchaseCategory(totalPurchaseCategory);
      setGeTtotalFundInputCategory(totalFundInputCategory);
    }

  };


  console.log("getTotalPoAmount", totalpoAmount1)
  console.log("setTotalExpanse1", totalExpanse1)
  console.log("setTotalIncome1", totalIncome1)
  console.log("setTotalBudject", totalbudject)//


  const percentageIncome = totalpoAmount1 > 0
    ? Math.min((totalIncome1 / totalpoAmount1) * 100, 100)
    : 0;

  const percentagebudjett = totalpoAmount1 > 0
    ? Math.min((totalbudject / totalpoAmount1) * 100, 100)
    : 0;

  const percentageExpan = totalbudject > 0
    ? Math.min((totalExpanse1 / totalbudject) * 100, 100)
    : 0;
  const grnpercentageExpan = totalbudject > 0
    ? Math.min((totalExpanse1 / totalbudject) * 100, 100)
    : 0;

  const differenceAmount = totalIncome1 - totalpoAmount1;

  const gaugeColor =
    percentageExpan > 75
      ? "#ff0000" // Red for > 75%
      : percentageExpan > 50
        ? "#ffa500" // Orange for > 50%
        : "#ffff00"; // Yellow for <= 50%

  const setting3 =
    formData1 === "PRN"
      ? {
        width: 200,
        height: 170,
        value: percentageExpan, // For PRN, display percentage income
        max: 100,
      }
      : {
        width: 200,
        height: 170,
        value: totalExpanse1, // For GRN, display percentage expense
        max: 100,
      };


  const settings = {
    width: 200,
    height: 170,
    value: totalpoAmount1,
    color: "white",
  };

  const setting1 = {
    width: 200,
    height: 170,
    value: totalIncome1,
    // displayValue: `70%`, // Dynamically appends "%" to the value
    max: 90,
  };
  const setting2 = {
    width: 200,
    height: 170,
    value: totalbudject,
  };
  const setting4 =
    formData1 === "PRN"
      ? {
        width: 200,
        height: 170,
        value: totalExpanse1, // For PRN, display percentage income
        max: 100,
      }
      : {
        width: 200,
        height: 170,
        value: totalExpanse1, // For GRN, display percentage expense
        max: 100,
      };

  // catagery 
  console.log("getTotalExpensesCategory", getTotalExpensesCategory)
  console.log("setTotalExpanse1", setTotalExpanse1)

  const setting5 = {
    width: 200,
    height: 170,
    value: getTotalExpensesCategory + "%",
  };
  const setting6 = {
    width: 200,
    height: 170,
    value: getTotalFundInputCategory,
  };
  const setting7 = {
    width: 200,
    height: 170,
    value: getTotalOverheadsCategory,
  };
  const setting8 = {
    width: 200,
    height: 170,
    value: getTotalPurchaseCategory,
  };
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return (
    <div style={{height:'200px'}}>
      <div className="dashContainer">
        <div className="dash_fContainer">
          <div className="dash_fContainer_filed">
            <TextField
              label="Start Date"
              name="startDate"
              variant="standard"
              fullWidth
              type="date"
              value={formData.startDate || ''}
              InputLabelProps={{ shrink: true }}
              onChange={handleChangeFormData}
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
            />

          </div>
          <div className="dashButton">
            <button onClick={handleView} >view</button>
            <button onClick={overall}>All</button>
          </div>
        </div>
        <div className="dashOverAllPo">
          <p style={{ color: 'white' }}>Over All PoAmount <BiCoinStack size={32} style={{ color: "orange" }} /></p>
          <p style={{ fontWeight: 'bold', color: 'white' }}>{totalpoAmount}</p>
        </div>
        <div className="dashOverAllExpanse">
          <p style={{ color: 'white' }}>Over All Expanse <AiFillCaretDown size={37} style={{ color: "orange" }} /></p>
          <p style={{ fontWeight: 'bold', color: 'white' }}>{gettotalExpanse}</p>
        </div>
        <div className="dashOverAllIncome">
          <p style={{ color: 'white' }}>Over All income <AiFillCheckSquare size={37} style={{ color: "orange" }} /></p>
          <p style={{ fontWeight: 'bold', color: 'white' }}>{totalIncome}</p>
        </div>
        <div className="dashOverAllProfit">
          <p style={{ color: 'white' }}>Over All profit <MdTrendingUp size={32} style={{ color: "orange" }} /></p>
          <p style={{ fontWeight: 'bold', color: 'white' }}>{overallProfit}</p>
        </div>
      </div> {/* overall dashboard */}
      <div className="prowise_dashboard">
        <div className="prowise_piechart">
          <div className="prowise_piechart_inline">
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: getTotalExpensesCategory, label: 'Expanse', color: 'orange' },
                    { id: 1, value: getTotalOverheadsCategory, label: 'Overheads' },
                    { id: 2, value: getTotalPurchaseCategory, label: 'Purchase' },
                  ],
                  label: {
                    style: {
                      fill: 'red', // Set label color
                      fontSize: '16px', // Set font size
                      fontWeight: 'bold', // Set font weight
                    },
                  },
                },
              ]}
              width={400}
              height={200}
              fill="#8884d8"
            />
          </div>
        </div>
        <div className="prowise_guage">
          <div className="prowise_guage_filter">
            <TextField
              label="Start Date"
              name="startDate"
              variant="standard"
              fullWidth
              type="date"
              value={formData1.startDate || ''}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "black",
                  fontWeight: 'bold',
                  fontSize: '20px'// Label color
                },
              }} onChange={handleChangeFormData1}
              style={{ width: '170px', marginTop: '7px', marginLeft: '20px' }}
            />

            <TextField
              label="End Date"
              name="endDate"
              variant="standard"
              fullWidth
              type="date"
              value={formData1.endDate || ''}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "black",
                  fontWeight: 'bold',
                  fontSize: '20px'// Label color
                },
              }} onChange={handleChangeFormData1}
              style={{ width: '170px', marginTop: '7px', marginLeft: '20px' }}
            />

            <TextField
              select
              label="Project No"
              name="projectNo"
              variant="standard"
              fullWidth
              value={formData1.projectNo || ""}
              InputProps={{
                style: {
                  color: "black", // Text color
                },
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "black",
                  fontWeight: 'bold',
                  fontSize: '20px'// Label color
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
          </div>
          <div className="prowise_guage_button">
            <button onClick={getProjectwiseAccountDetail}>view</button>
          </div>
          <div className="prowise_guage_Po">
            <Gauge
              {...settings}
              cornerRadius="50%"
              sx={(theme) => ({
                [`& .actualClassName`]: { // Replace "actualClassName" with the observed class
                  fill: 'white !important',
                  color: 'white !important',
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
          <div className="prowise_guage_Po_Name">
          <p>Po Amount</p>
          </div>

          <div className="prowise_guage_Income">
          <Gauge
    {...setting1}
    cornerRadius="50%"
    sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
            fontSize: 21,
            color: 'white',  // Ensure the value text is visible
        },
        [`& .${gaugeClasses.valueArc}`]: {
            fill: '#52b202',  // Adjust the fill color for the gauge
        },
        [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,  // Background arc color
        },
    })}
/>

          </div>
          <div className="prowise_guage_Income_Name">
          <p style={{ fontFamily: "Arial, sans-serif"}}>Income</p>

          </div>
          
          <div className="prowise_guage_Budget"> 

          <Gauge
                        {...setting2}
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 21,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: '#9C27B0',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                            },
                        })}
                    />
          </div>
          <div className="prowise_guage_Budget_Name">
          <p style={{ fontFamily: "Arial, sans-serif"}}>Budjet</p>
          </div>
          <div className="prowise_guage_Expanse"> 
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

            
          </div>
          <div className="prowise_guage_Expanse_Name">
          <p style={{ fontFamily: "Arial, sans-serif"}}>Expanse</p>
          </div>
          <div className="prowise_guage_AvailBuget"> 
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

          </div>
          <div className="prowise_guage_AvailableBudget_Name">
          <p style={{ fontFamily: "Arial, sans-serif"}}>Available Budget</p>
          </div>


        </div>
        <div className="prowise_barchart">
          <div className="prowise_barchart_Bar">
          <Bar data={data} options={options}>
                            {renderChartData(data)}
                        </Bar>
          </div>


        </div>

      </div>





    </div>//Entire 
  )
}

export default Workout