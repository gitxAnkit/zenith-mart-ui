import React, { Fragment, useState, useEffect, useRef } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserErrors as clearErrors,
  updateProfile,
  loadUser,
} from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { updateProfileReset } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Resizer from "react-image-file-resizer";
import ErrorBoundary from "../../ErrorBoundary";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastShownRef = useRef(false); // Add a ref to track if the toast has already been shown

  const { user, error, isUpdated, loading } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null,
    avatarPreview: "/Profile.png",
  });

  // Handle form submission
  const updateProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const myForm = new FormData();

      myForm.set("name", formData.name);
      myForm.set("email", formData.email);

      if (formData.avatar) {
        myForm.set("avatar", formData.avatar);
      }

      await dispatch(updateProfile(myForm));
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const updateProfileDataChange = async (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];

      if (file) {
        try {
          Resizer.imageFileResizer(
            file,
            500, // maxWidth
            500, // maxHeight
            "JPEG", // output format
            90, // quality
            0, // rotation
            (uri) => {
              setFormData((prev) => ({
                ...prev,
                avatar: uri,
                avatarPreview: uri,
              }));
            },
            "base64" // output type
          );
        } catch (err) {
          toast.error("Image processing failed");
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    // Initialize form with user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: null,
        avatarPreview: user.avatar?.url || "/Profile.png",
      });
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated && !toastShownRef.current) {
      // Show the toast only if it hasn't been shown yet
      toast.success("Profile Updated Successfully");
      toastShownRef.current = true; // Set ref to true after showing the toast

      dispatch(loadUser());
      navigate("/account");
      dispatch(updateProfileReset());
    }
  }, [dispatch, error, navigate, user, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <ErrorBoundary>
          <Fragment>
            <MetaData title="Update Profile" />
            <div className="updateProfileContainer">
              <div className="updateProfileBox">
                <h2 className="updateProfileHeading">Update Profile</h2>

                <form
                  className="updateProfileForm"
                  encType="multipart/form-data"
                  onSubmit={updateProfileSubmit}
                >
                  <div className="updateProfileName">
                    <FaceIcon />
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      name="name"
                      value={formData.name}
                      onChange={updateProfileDataChange}
                    />
                  </div>
                  <div className="updateProfileEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={updateProfileDataChange}
                    />
                  </div>

                  <div id="updateProfileImage">
                    <img src={formData.avatarPreview} alt="Avatar Preview" />
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={updateProfileDataChange}
                    />
                  </div>

                  <input
                    type="submit"
                    value="Update"
                    className="updateProfileBtn"
                    disabled={loading}
                  />
                </form>
              </div>
            </div>
          </Fragment>
        </ErrorBoundary>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
