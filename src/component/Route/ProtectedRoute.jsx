import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { loadUser } from "../../actions/userAction";
const ProtectedRoute = ({ isAdmin }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadUser());
    } else {
      setIsLoading(false);
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setIsLoading(false);
    }
  }, [loading, isAuthenticated]);

  if (isLoading === true) {
    return (
      <div className="loading-spinner">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isAdmin && (!user?.role || user.role !== "admin")) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
