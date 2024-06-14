import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Analytics = () => {
  const usersChartRef = useRef(null);
  const contentUploadChartRef = useRef(null);
  const transactionsChartRef = useRef(null);
  const contentTypesChartRef = useRef(null); // Reference for the content types pie chart

  useEffect(() => {
    // Sample data for visualization
    const usersData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Consumers',
          data: [50, 60, 70, 80, 90, 100, 110],
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Creators',
          data: [40, 45, 50, 55, 60, 65, 70],
          borderColor: 'green',
          fill: false,
        },
      ],
    };

    const contentUploadData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Audio',
          data: [30, 35, 40, 45, 50, 55, 60],
          borderColor: 'red',
          fill: false,
        },
        {
          label: 'Video',
          data: [20, 25, 30, 35, 40, 45, 50],
          borderColor: 'orange',
          fill: false,
        },
        {
          label: 'Ebook',
          data: [10, 15, 20, 25, 30, 35, 40],
          borderColor: 'purple',
          fill: false,
        },
      ],
    };

    const transactionsData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Transactions',
          data: [100, 120, 140, 160, 180, 200, 220],
          borderColor: 'black',
          fill: false,
        },
      ],
    };

    const contentTypesData = {
      labels: ['Audio', 'Video', 'Ebook'],
      datasets: [
        {
          label: 'Content Types',
          data: [30, 40, 30],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    // Configure and render the users chart
    if (usersChartRef.current) {
      new Chart(usersChartRef.current, {
        type: 'line',
        data: usersData,
      });
    }

    // Configure and render the content upload chart
    if (contentUploadChartRef.current) {
      new Chart(contentUploadChartRef.current, {
        type: 'line',
        data: contentUploadData,
      });
    }

    // Configure and render the transactions chart
    if (transactionsChartRef.current) {
      new Chart(transactionsChartRef.current, {
        type: 'line',
        data: transactionsData,
      });
    }

    // Configure and render the content types pie chart
    if (contentTypesChartRef.current) {
      new Chart(contentTypesChartRef.current, {
        type: 'pie',
        data: contentTypesData,
      });
    }
  }, []);


  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-2 gap-6">
        {/* Users Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users Over Time</h2>
          <canvas ref={usersChartRef}></canvas>
        </div>
        
        {/* Content Upload Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Content Upload Over Time</h2>
          <canvas ref={contentUploadChartRef}></canvas>
        </div>

        {/* Transactions Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Transactions Over Time</h2>
          <canvas ref={transactionsChartRef}></canvas>
        </div>

        {/* Content Types Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Content Types</h2>
          <canvas ref={contentTypesChartRef}></canvas>
        </div>
      </div>
    </div>
  );

};

export default Analytics;
