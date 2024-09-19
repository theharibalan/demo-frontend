import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList,
} from 'recharts';
import * as XLSX from 'xlsx';
import { Empty } from 'antd';


const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return { day, month: month - 1, year };
};



const generateBarChartData = (data, year, filter) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const initialData = months.map(month => ({ month, count: 0 }));

  data.forEach(item => {
    const { year: itemYear, month: itemMonth } = parseDate(item.date_of_order);

    if (itemYear === parseInt(year)) {
      switch (filter) {
        case 'total':
          initialData[itemMonth].count += 1;
          break;
        case 'pendingPayment':
          if (!item.payment_status) initialData[itemMonth].count += 1;
          break;
        case 'ordersDelivered':
          if (item.deliveryStatus) initialData[itemMonth].count += 1;
          break;
        case 'ordersNotDelivered':
          if (item.payment_status && !item.deliveryStatus) initialData[itemMonth].count += 1;
          break;
        case 'unapprovedPayments':
          if (item.payment_status && !item.payment_verified) initialData[itemMonth].count += 1;
          break;
        default:
          break;
      }
    }
  });

  return initialData;
};

const downloadExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, fileName);
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('total');
  const [data, setData] = useState([]);

  useEffect(() => {

    const url = `${process.env.REACT_APP_BACKEND_URL}/b2b/getorders`;
    axios
      .post(url,{},{headers: {
        Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        "Content-Type": "application/json",
      }})
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const uniqueYears = [...new Set(data.map(item => parseDate(item.date_of_order).year))];

  const barChartData = generateBarChartData(data, selectedYear, selectedFilter);

  const filteredData = data.filter(item => {
    const { year: itemYear } = parseDate(item.date_of_order);
    switch (selectedFilter) {
      case 'total':
        return itemYear === parseInt(selectedYear);
      case 'pendingPayment':
        return itemYear === parseInt(selectedYear) && !item.payment_status;
      case 'ordersDelivered':
        return itemYear === parseInt(selectedYear) && item.deliveryStatus;
      case 'ordersNotDelivered':
        return itemYear === parseInt(selectedYear) && item.payment_status && !item.deliveryStatus;
      case 'unapprovedPayments':
        return itemYear === parseInt(selectedYear) && item.payment_status && !item.payment_verified;
      default:
        return false;
    }
  });

  const handleDownload = () => {
    const fileName = `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} - ${selectedYear}.xlsx`;
    downloadExcel(filteredData, fileName);
  };

  return (
    <div style={{ display: 'flex', width: '95vw', marginBottom: "5vh", marginTop: "2vh" }}>
      <div style={{ width: '50%', overflow: 'hidden' }}>
        <div style={{ marginBottom: "30px" ,textAlign:"left",marginLeft:"50px"}}>
          <select style={{marginRight:'20px'}} value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select className='admin-select-box' value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)}>
            <option value="total">Total No of Orders</option>
            <option value="pendingPayment">Orders with Payment Pending</option>
            <option value="ordersDelivered">Orders Delivered</option>
            <option value="ordersNotDelivered">Orders Not Delivered</option>
            <option value="unapprovedPayments">Unapproved Payments</option>
          </select>
          <button style={{ marginLeft: "10px", padding: "5px" }} className='button-7' onClick={handleDownload}>Download Reports</button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {/* <Legend content={<CustomLegend />} /> */}
            <Bar dataKey="count" fill="#0077CC" barSize={20}>
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='admin-table-ctn' style={{ width: '50%', overflow: 'auto', maxHeight: '300px' }}>
        <table className='admin-table' style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Company Name</th>
              <th>Payment Status</th>
              <th>Date of Order Placed</th>
              <th>Contact Details</th>
            </tr>
          </thead>
          <tbody>
    {filteredData.length > 0 ? (
      filteredData.map(order => (
        <tr key={order.orderId}>
          <td>{order.orderId}</td>
          <td>{order.companyname}</td>
          <td>{order.payment_status ? 'Paid' : 'Pending'}</td>
          <td>{order.date_of_order}</td>
          <td>{order.phone_no} | {order.email}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5">
            <Empty description="No Records" />
        </td>
      </tr>
    )}
  </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
