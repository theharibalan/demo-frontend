import React from 'react';
import CountUp from 'react-countup';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './CustomerReviews.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerDashboard = () => {
  const totalCustomers = 1200;
  const satisfactionScore = 4.6; 

  const chartData = {
    labels: ['Satisfaction', 'Remaining'],
    datasets: [
      {
        data: [satisfactionScore, 5 - satisfactionScore],
        backgroundColor: ['#4caf50', '#ddd'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="card">
        <h3>Total Customers</h3>
        <div className="countup">
          <CountUp end={totalCustomers} duration={10} />
        </div>
      </div>
      <div className="card">
        <h3>Customer Satisfaction</h3>
        <div className="donut-chart">
          <Doughnut
            data={chartData}
            options={{
              cutout: '80%',
              plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
              },
            }}
          />
          <div className="satisfaction-score">
            {satisfactionScore}/5
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
