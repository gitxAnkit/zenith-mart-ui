import React, { Fragment, useState, useEffect } from 'react';
import './ResetPassword.css';
import Loader from '../layout/Loader/Loader';
import { useResetPassword } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import MetaData from '../layout/MetaData';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const resetPasswordMutation = useResetPassword();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      toast.success('Password Updated Successfully');
      navigate('/login');
    }
    if (resetPasswordMutation.isError) {
      const err = resetPasswordMutation.error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Something went wrong');
    }
  }, [resetPasswordMutation.isSuccess, resetPasswordMutation.isError, resetPasswordMutation.error, navigate]);

  const resetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    resetPasswordMutation.mutate({ token, passwords: { password, confirmPassword } });
  };

  const isLoading = resetPasswordMutation.isPending;

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Update Profile</h2>
              <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
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
                  value="Update"
                  className="resetPasswordBtn"
                  disabled={isLoading}
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;
