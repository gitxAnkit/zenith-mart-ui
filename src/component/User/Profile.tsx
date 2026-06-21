import React, { Fragment, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, loading, isAuthenticated } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {user && (
            <>
              <MetaData title={`${user.name}'s Profile`} />
              <div className="profilePage">
                <div className="profileHeader">
                  <h1>My Account</h1>
                </div>

                <div className="profileContainer">
                  {/* Left Side: Avatar & Edit Profile */}
                  <div className="profileLeft">
                    <div className="avatarContainer">
                      <img src={user.avatar?.url || "/Profile.png"} alt={user.name} />
                    </div>
                    <Link to="/me/update" className="editProfileBtn">
                      Edit Profile
                    </Link>
                  </div>

                  {/* Right Side: Details */}
                  <div className="profileRight">
                    <div className="detailsGroup">
                      <h4>Full Name</h4>
                      <p>{user.name}</p>
                    </div>
                    <div className="detailsGroup">
                      <h4>Email</h4>
                      <p>{user.email}</p>
                    </div>
                    <div className="detailsGroup">
                      <h4>Joined</h4>
                      <p>
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Container at the bottom */}
                <div className="quickActionsContainer">
                  <h3>Quick Actions</h3>
                  <div className="actionButtons">
                    <Link to="/orders" className="actionBtn">
                      My Orders
                    </Link>
                    <Link to="/password/update" className="actionBtn">
                      Change Password
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
