import React from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./NotFound.css";
import { Error } from "@mui/icons-material";

const NotFound = () => {
  return (
    <div className="pageNotFound">
      <Error className="errorIcon" />

      <Typography variant="h4" className="errorText">
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" className="errorMessage">
        The page you're looking for doesn't exist or has been moved.
      </Typography>

      <Link to="/" className="homeLink">
        <Button variant="contained" color="primary">
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
