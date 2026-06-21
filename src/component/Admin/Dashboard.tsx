import React from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import MetaData from '../layout/MetaData';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useAllOrders } from '../../hooks/useOrders';
import { useAllUsers } from '../../hooks/useUsers';
import Loader from '../layout/Loader/Loader';

// Registering ChartJS modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ErrorBoundary from '../../ErrorBoundary';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const { data: products, isLoading: loadingProducts } = useAdminProducts();
  const { data: ordersData, isLoading: loadingOrders } = useAllOrders();
  const { data: users, isLoading: loadingUsers } = useAllUsers();

  if (loadingProducts || loadingOrders || loadingUsers) {
    return <Loader />;
  }

  const productsList = (products || []) as any[];
  const ordersList = ordersData?.orders || [];
  const totalAmount = ordersData?.totalAmount || 0;

  let outOfStock = 0;
  productsList.forEach((item) => {
    if (item.Stock === 0) {
      outOfStock += 1;
    }
  });

  const lineState = {
    labels: ['Initial Amount', 'Amount Earned'],
    datasets: [
      {
        label: 'TOTAL AMOUNT',
        backgroundColor: ['tomato'],
        hoverBackgroundColor: ['rgb(197, 72, 49)'],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ['Out of Stock', 'InStock'],
    datasets: [
      {
        backgroundColor: ['#00A6B4', '#6800B4'],
        hoverBackgroundColor: ['#4B5000', '#35014F'],
        data: [outOfStock, productsList.length - outOfStock],
      },
    ],
  };

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <MetaData title="Dashboard - Admin Panel" />
        <Sidebar />
        <div className="dashboardContainer">
          <Typography component="h1">Dashboard</Typography>
          <div className="dashboardSummary">
            <div>
              <p>
                Total Amount <br /> ₹{totalAmount}
              </p>
            </div>
            <div className="dashboardSummaryBox2">
              <Link to="/admin/products">
                <p>Product</p>
                <p>{productsList.length}</p>
              </Link>
              <Link to="/admin/orders">
                <p>Orders</p>
                <p>{ordersList.length}</p>
              </Link>
              <Link to="/admin/users">
                <p>Users</p>
                <p>{users?.length || 0}</p>
              </Link>
            </div>
          </div>
          <div className="lineChart">
            <Line data={lineState} />
          </div>

          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
