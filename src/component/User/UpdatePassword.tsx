import React, { Fragment, useState, useEffect, useRef } from 'react';
import './UpdatePassword.css';
import Loader from '../layout/Loader/Loader';
import { useUpdatePassword } from '../../hooks/useAuth';
import MetaData from '../layout/MetaData';
import { LockOpen, Lock, VpnKey } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorBoundary from '../../ErrorBoundary';

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const toastShownRef = useRef(false);
  const updatePasswordMutation = useUpdatePassword();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (updatePasswordMutation.isSuccess && !toastShownRef.current) {
      toast.success('Password Updated Successfully', { autoClose: 1000 });
      toastShownRef.current = true;
      navigate('/account');
    }
    if (updatePasswordMutation.isError) {
      const err = updatePasswordMutation.error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Password update failed');
    }
  }, [updatePasswordMutation.isSuccess, updatePasswordMutation.isError, updatePasswordMutation.error, navigate]);

  const updatePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePasswordMutation.mutate({ oldPassword, newPassword, confirmPassword });
  };

  const isLoading = updatePasswordMutation.isPending;

  return (
    <Fragment>
      <ErrorBoundary>
        {isLoading ? (
          <Loader />
        ) : (
          <Fragment>
            <MetaData title="Change Password" />
            <div className="updatePasswordContainer">
              <div className="updatePasswordBox">
                <h2 className="updatePasswordHeading">Update Password</h2>
                <form className="updatePasswordForm" onSubmit={updatePasswordSubmit}>
                  <div className="loginPassword">
                    <VpnKey />
                    <input
                      type="password"
                      placeholder="Old Password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="loginPassword">
                    <LockOpen />
                    <input
                      type="password"
                      placeholder="New Password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="loginPassword">
                    <Lock />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <input
                    type="submit"
                    value="Change"
                    className="updatePasswordBtn"
                    disabled={isLoading}
                  />
                </form>
              </div>
            </div>
          </Fragment>
        )}
      </ErrorBoundary>
    </Fragment>
  );
};

export default UpdatePassword;
