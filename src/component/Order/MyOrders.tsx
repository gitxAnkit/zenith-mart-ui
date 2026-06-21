import React, { Fragment, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './MyOrders.css';
import { useAppSelector } from '../../redux/hooks';
import { useMyOrders } from '../../hooks/useOrders';
import Loader from '../layout/Loader/Loader';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import LaunchIcon from '@mui/icons-material/Launch';
import { toast } from 'react-toastify';
import MetaData from '../layout/MetaData';

const MyOrders: React.FC = () => {
  const { data: orders, isLoading, error } = useMyOrders();
  const { user } = useAppSelector((state) => state.user);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', minWidth: 300, flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.row.status === 'Delivered' ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: 'actions',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];

  const rows: Array<{
    id: string;
    status: string;
    itemsQty: number;
    amount: number;
  }> = [];

  if (orders) {
    orders.forEach((item) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.pricingInfo?.totalPrice ?? (item as any).totalPrice ?? 0,
      });
    });
  }

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load orders');
    }
  }, [error]);

  return (
    <Fragment>
      <MetaData title={`${user?.name || 'User'} - Orders`} />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <Typography variant="h5" gutterBottom>
            {user?.name}'s Orders
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
