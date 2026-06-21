import React, { Fragment, useState, useEffect, useRef } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, updatePassword } from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import { LockOpen, Lock, VpnKey } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { updatePasswordReset } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "../../ErrorBoundary";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  const { error, isUpdated, loading } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserErrors());
    }

    if (isUpdated && !toastShownRef.current) {
      toast.success("Password Updated Successfully", {
        autoClose: 1000,
      });
      toastShownRef.current = true;
      navigate("/account");
      dispatch(updatePasswordReset());
    }
  }, [dispatch, error, navigate, isUpdated]);

  return (
    <Fragment>
      <ErrorBoundary>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <MetaData title="Change Password" />
            <div className="updatePasswordContainer">
              <div className="updatePasswordBox">
                <h2 className="updatePasswordHeading">Update Password</h2>
                <form
                  className="updatePasswordForm"
                  onSubmit={updatePasswordSubmit}
                >
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
