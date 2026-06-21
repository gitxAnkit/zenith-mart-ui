import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "#f7f7f7",
        padding: "20px",
      }}
    >
      <Typography variant="h2" sx={{ color: "#d32f2f", marginBottom: "20px" }}>
        Access Denied
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: "30px" }}>
        You do not have permission to access this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ padding: "10px 20px" }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default AccessDenied;
