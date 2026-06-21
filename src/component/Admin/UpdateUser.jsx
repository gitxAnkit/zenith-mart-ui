import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import SideBar from "./Sidebar";
import {
  getUserDetails,
  updateUser,
  clearUserErrors,
} from "../../actions/userAction";
import { updateUserReset } from "../../redux/slices/userSlice";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const { error, loading, user, isUpdated } = useSelector(
    (state) => state.user
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setRole(user?.role || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearUserErrors());
    }

    if (isUpdated) {
      toast.success("User Updated Successfully");
      navigate("/admin/users");
      dispatch(updateUserReset());
    }
  }, [dispatch, error, isUpdated, user, userId, navigate]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };

  return (
    <>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
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
                margin="normal"
              >
                <MenuItem value="">Choose Role</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={loading || role === ""}
                sx={{ marginTop: "20px" }}
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
