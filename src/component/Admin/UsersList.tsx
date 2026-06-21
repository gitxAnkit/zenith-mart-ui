import React, { Fragment, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './ProductList.css';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SideBar from './Sidebar';
import { useAllUsers, useDeleteUser } from '../../hooks/useUsers';
import { toast } from 'react-toastify';
import Loader from '../layout/Loader/Loader';

const UsersList: React.FC = () => {
  const { data: users, isLoading, error } = useAllUsers();
  const deleteUserMutation = useDeleteUser();

  const deleteUserHandler = (id: string) => {
    deleteUserMutation.mutate(id, {
      onSuccess: (data: any) => {
        toast.success(data?.message ?? 'User Deleted Successfully');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? 'Failed to delete user');
      },
    });
  };

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load users');
    }
  }, [error]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'User ID', minWidth: 180, flex: 0.8 },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) =>
        params.row.role === 'admin' ? 'greenColor' : 'redColor',
    },
    {
      field: 'actions',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Fragment>
          <Link to={`/admin/user/${params.row.id}`}>
            <EditIcon />
          </Link>
          <Button onClick={() => deleteUserHandler(params.row.id as string)}>
            <DeleteIcon />
          </Button>
        </Fragment>
      ),
    },
  ];

  const rows =
    users?.map((item) => ({
      id: item._id,
      role: item.role,
      email: item.email,
      name: item.name,
    })) || [];

  return (
    <Fragment>
      <MetaData title="ALL USERS - Admin" />
      {isLoading || deleteUserMutation.isPending ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <SideBar />
          <div className="productListContainer">
            <h1 id="productListHeading">ALL USERS</h1>

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
    </Fragment>
  );
};

export default UsersList;
