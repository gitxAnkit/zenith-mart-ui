import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, TextField, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';
import SideBar from './Sidebar';
import { useUserDetails, useUpdateUser } from '../../hooks/useUsers';
import ErrorBoundary from '../../ErrorBoundary';

const UpdateUser: React.FC = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams<{ id: string }>();

  const { data: user, isLoading: loadingDetails, error: detailsError } = useUserDetails(userId);
  const updateUserMutation = useUpdateUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || '');
    }
  }, [user]);

  useEffect(() => {
    if (detailsError) {
      const err = detailsError as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load user details');
    }
  }, [detailsError]);

  const updateUserSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    updateUserMutation.mutate(
      {
        id: userId,
        userData: { name, email, role },
      },
      {
        onSuccess: () => {
          toast.success('User Updated Successfully');
          navigate('/admin/users');
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Failed to update user');
        },
      }
    );
  };

  const isLoading = loadingDetails || updateUserMutation.isPending;

  return (
    <ErrorBoundary>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {isLoading ? (
            <Loader />
          ) : (
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <TextField
                label="Name"
                variant="outlined"
                required
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
              />
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                displayEmpty
                fullWidth
                required
              >
                <option value="" disabled>
                  Choose Role
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Select>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={updateUserMutation.isPending || role === ''}
                sx={{ marginTop: '20px' }}
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default UpdateUser;
