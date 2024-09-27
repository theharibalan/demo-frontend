import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import OrdersCharts from "./OrdersCharts";
import axios from "axios";
import generatePo from "../GeneratePO";
import { Empty } from 'antd';
import PoModal from "./DownloadPoComponent";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const CustomLegend = ({ payload }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: entry.color,
              marginRight: "8px",
            }}
          />
          <span
            style={{ color: entry.color }}
          >{`${entry.value}: ${entry.payload.value}`}</span>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const [poBtnText, setPoBtnText] = useState("Download Purchase Order")
  const [data, setData] = useState([]);
  useEffect(() => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/getorders`;
    axios
      .post(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          "Content-Type": "application/json",
        }
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("08");

  const filteredData = data.filter((order) =>
    order.date_of_order.includes(`${selectedMonth}/${selectedYear}`)
  );

  const ordersChartData = [
    {
      name: "New Orders",
      value: filteredData.filter(
        (order) =>
          order.payment_status === 0 ||
          (order.payment_verified === 1 && order.deliveryStatus === 0)
      ).length,
    },
    {
      name: "Orders Delivered",
      value: filteredData.filter(
        (order) => order.payment_verified === 1 && order.deliveryStatus === 1
      ).length,
    },
    {
      name: "Orders Yet to be Delivered",
      value: filteredData.filter(
        (order) => order.payment_verified === 1 && order.deliveryStatus === 0
      ).length,
    },
  ];

  const paymentsChartData = [
    {
      name: "Pending Payments",
      value: filteredData.filter((order) => order.payment_status === 0).length,
    },
    {
      name: "Payments Approved",
      value: filteredData.filter(
        (order) => order.payment_status === 1 && order.payment_verified === 1
      ).length,
    },
    {
      name: "Payments yet to be Approved",
      value: filteredData.filter(
        (order) => order.payment_status === 1 && order.payment_verified === 0
      ).length,
    },
  ];

  const handleDownloadPo = async () => {
    setPoBtnText("Generating ....")
    const url = await generatePo(data);
    setPoBtnText("Download Purchase Order")
  };
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div style={{ textAlign: "center"
}}>
      <h1>Order and Payment Dashboard</h1>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        style={{ margin: "0 10px" }}
      >
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </select>

      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={{ margin: "0 10px" }}
      >
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <span style={{ fontSize: "18px", fontWeight: "500" }}>
        Total orders for {months[parseInt(selectedMonth) - 1]} month :{" "}
        {filteredData.length}
      </span>
      
      <button className="po-btn button-7" onClick={handleOpenModal} type="primary">
        {poBtnText}
      </button>

      <PoModal
        visible={modalVisible}
        onClose={handleCloseModal}
        data={data}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "40px",
            borderRadius: "7px",
          }}
        >
          <PieChart width={300} height={300}>
            {filteredData && filteredData.length > 0 ? (
              <Pie
                data={ordersChartData}
                cx={150}
                cy={150}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ordersChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            ) : (
              <foreignObject x="0" y="70" width="300" height="300">
              <Empty description="No Orders Found" />
            </foreignObject>
            )}
            <Tooltip />
          </PieChart>
          <CustomLegend
            payload={ordersChartData.map((entry, index) => ({
              value: entry.name,
              color: COLORS[index % COLORS.length],
              payload: entry,
            }))}
          />
        </div>

        <div
          style={{ display: "flex", alignItems: "center", borderRadius: "7px" }}
        >
          <PieChart width={300} height={300}>
          {filteredData && filteredData.length > 0 ? (
            <Pie
              data={paymentsChartData}
              cx={150}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentsChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
             ) : (
              <foreignObject x="0" y="70" width="300" height="300">
              <Empty description="No Orders Found" />
            </foreignObject>
            )}
            <Tooltip />
          </PieChart>
          <CustomLegend
            payload={paymentsChartData.map((entry, index) => ({
              value: entry.name,
              color: COLORS[index % COLORS.length],
              payload: entry,
            }))}
          />
        </div>
      </div>

      <OrdersCharts
        style={{ marginTop: "4vh", marginBottom: "50vh", width: "90vw" }}
      />
    </div >
  );
};

export default Dashboard;
