import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

interface ProtectedRouteProps {
  isAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAdmin = false }) => {
  const { loading, isAuthenticated, user } = useAppSelector(
    (state) => state.user,
  );
  const location = useLocation();

  // While the session check is in flight show a loader
  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
