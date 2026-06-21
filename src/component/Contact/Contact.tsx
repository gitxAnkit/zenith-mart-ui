import React from "react";
import "./Contact.css";
import { Button, Typography, Container } from "@mui/material";

const Contact = () => {
  return (
    <Container className="contactContainer">
      <Typography variant="h4" className="contactHeader">
        Get in Touch
      </Typography>
      <Typography variant="body1" className="contactDescription">
        If you have any questions or inquiries, feel free to reach out!
      </Typography>
      <div className="contactMethods">
        <a className="mailBtn" href="mailto:dummydev0515@gmail.com">
          <Button variant="contained" color="primary">
            Email: ankitv469@gmail.com
          </Button>
        </a>
        <a className="phoneBtn" href="tel:+1234567890">
          <Button variant="contained" color="secondary">
            Phone: +91 8318785767
          </Button>
        </a>
      </div>
    </Container>
  );
};

export default Contact;
