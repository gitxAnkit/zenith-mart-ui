import React, { Fragment, useState, useEffect } from 'react';
import './ForgotPassword.css';
import Loader from '../layout/Loader/Loader';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useForgotPassword } from '../../hooks/useAuth';
import MetaData from '../layout/MetaData';
import { toast } from 'react-toastify';
import ErrorBoundary from '../../ErrorBoundary';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (forgotPasswordMutation.isSuccess && forgotPasswordMutation.data) {
      toast.success(forgotPasswordMutation.data);
      navigate('/login');
    }
    if (forgotPasswordMutation.isError) {
      const err = forgotPasswordMutation.error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Something went wrong');
    }
  }, [forgotPasswordMutation.isSuccess, forgotPasswordMutation.isError, forgotPasswordMutation.data, forgotPasswordMutation.error, navigate]);

  const forgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };

  const isLoading = forgotPasswordMutation.isPending;

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <ErrorBoundary>
            <MetaData title="Forgot Password" />
            <div className="forgotPasswordContainer">
              <div className="forgotPasswordBox">
                <h2 className="forgotPasswordHeading">Forgot Password</h2>
                <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>
                  <div className="forgotPasswordEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <input
                    type="submit"
                    value="Send"
                    className="forgotPasswordBtn"
                    disabled={isLoading}
                  />
                </form>
              </div>
            </div>
          </ErrorBoundary>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
