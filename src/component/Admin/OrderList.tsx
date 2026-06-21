import React, { Fragment, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './ProductList.css';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import SideBar from './Sidebar';
import { useAllOrders } from '../../hooks/useOrders';
import { useDeleteOrder } from '../../hooks/useOrderMutations';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from '../../ErrorBoundary';
import { Delete, Edit } from '@mui/icons-material';
import Loader from '../layout/Loader/Loader';

const OrderList: React.FC = () => {
  const { data: ordersData, isLoading, error } = useAllOrders();
  const deleteOrderMutation = useDeleteOrder();

  const deleteOrderHandler = (id: string) => {
    deleteOrderMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Order Deleted Successfully');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? 'Failed to delete order');
      },
    });
  };

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load orders');
    }
  }, [error]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', minWidth: 300, flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) =>
        params.row.status === 'Delivered' ? 'greenColor' : 'redColor',
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 150,
      flex: 0.4,
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
      renderCell: (params) => (
        <Fragment>
          <Link to={`/admin/order/${params.row.id}`}>
            <Edit />
          </Link>
          <Button onClick={() => deleteOrderHandler(params.row.id as string)}>
            <Delete />
          </Button>
        </Fragment>
      ),
    },
  ];

  const orders = ordersData?.orders || [];
  const rows = orders.map((item) => ({
    id: item._id,
    itemsQty: item.orderItems.length,
    amount: item.pricingInfo?.totalPrice ?? (item as any).totalPrice ?? 0,
    status: item.orderStatus,
  }));

  return (
    <Fragment>
      <ErrorBoundary>
        <MetaData title="ALL ORDERS - Admin" />

        {isLoading || deleteOrderMutation.isPending ? (
          <Loader />
        ) : (
          <div className="dashboard">
            <SideBar />
            <div className="productListContainer">
              <h1 id="productListHeading">ALL ORDERS</h1>

              <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                className="productListTable"
                autoHeight
              />
            </div>
          </div>
        )}
      </ErrorBoundary>
    </Fragment>
  );
};

export default OrderList;
