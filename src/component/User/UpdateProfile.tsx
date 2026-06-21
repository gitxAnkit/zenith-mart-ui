import React, { Fragment, useState, useEffect, useRef } from 'react';
import './UpdateProfile.css';
import Loader from '../layout/Loader/Loader';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FaceIcon from '@mui/icons-material/Face';
import { useAppSelector } from '../../redux/hooks';
import { useUpdateProfile } from '../../hooks/useAuth';
import MetaData from '../layout/MetaData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Resizer from 'react-image-file-resizer';
import ErrorBoundary from '../../ErrorBoundary';

const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();
  const toastShownRef = useRef(false);
  const updateProfileMutation = useUpdateProfile();

  const { user } = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: null as string | null,
    avatarPreview: '/Profile.png',
  });

  // Pre-fill form with current user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        avatarPreview: user.avatar?.url || '/Profile.png',
      }));
    }
  }, [user]);

  // Handle mutation success/error
  useEffect(() => {
    if (updateProfileMutation.isSuccess && !toastShownRef.current) {
      toast.success('Profile Updated Successfully');
      toastShownRef.current = true;
      navigate('/account');
    }
    if (updateProfileMutation.isError) {
      const err = updateProfileMutation.error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Update failed');
    }
  }, [updateProfileMutation.isSuccess, updateProfileMutation.isError, updateProfileMutation.error, navigate]);

  const updateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('name', formData.name);
    myForm.set('email', formData.email);
    if (formData.avatar) {
      myForm.set('avatar', formData.avatar);
    }
    updateProfileMutation.mutate(myForm);
  };

  const updateProfileDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files?.[0];
      if (file) {
        Resizer.imageFileResizer(
          file, 500, 500, 'JPEG', 90, 0,
          (uri) => {
            setFormData((prev) => ({
              ...prev,
              avatar: uri as string,
              avatarPreview: uri as string,
            }));
          },
          'base64'
        );
      }
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const isLoading = updateProfileMutation.isPending;

  return (
    <Fragment>
      {isLoading ? (
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
                    disabled={isLoading}
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
