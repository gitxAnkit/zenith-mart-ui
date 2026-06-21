import React, { useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './ProductList.css';
import { useAdminProducts, useDeleteProduct } from '../../hooks/useAdminProducts';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import SideBar from './Sidebar';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../layout/Loader/Loader';

const ProductList: React.FC = () => {
  const { data: products, isLoading, error } = useAdminProducts();
  const deleteProductMutation = useDeleteProduct();

  const deleteProductHandler = (id: string) => {
    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Product Deleted Successfully');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? 'Delete failed');
      },
    });
  };

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load products');
    }
  }, [error]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Product ID', minWidth: 200, flex: 0.5 },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 350,
      flex: 1,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: 'price',
      headerName: 'Price',
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
          <>
            <Link to={`/admin/product/${params.id}`}>
              <Edit />
            </Link>
            <Button onClick={() => deleteProductHandler(params.id as string)}>
              <Delete />
            </Button>
          </>
        );
      },
    },
  ];

  const rows =
    (products as any[])?.map((item) => ({
      id: item._id,
      stock: item.Stock,
      price: item.price,
      name: item.name,
    })) || [];

  return (
    <>
      <MetaData title="ALL PRODUCTS - Admin" />
      {isLoading || deleteProductMutation.isPending ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <SideBar />
          <div className="productListContainer">
            <h1 id="productListHeading">ALL PRODUCTS</h1>
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
    </>
  );
};

export default ProductList;
