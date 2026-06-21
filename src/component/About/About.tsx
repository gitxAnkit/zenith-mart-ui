import React from "react";
import "./about.css";
import { Button, Typography, Avatar } from "@mui/material";
import { Instagram, Twitter } from "@mui/icons-material";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/";
  };

  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Zenith-Mart</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dlbcv2oft/image/upload/v1729023353/ankit__xjwniz.jpg" // Placeholder for your logo or image
              alt="Zenith-Mart Logo"
            />
            <Typography component="h2">Zenith-Mart</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              Welcome to Zenith-Mart, your one-stop destination for a
              comprehensive and seamless online shopping experience! Our goal is
              to provide you with the best selection of products, competitive
              pricing, and unmatched customer service.
            </span>
          </div>

          <div className="aboutSectionContainer2">
            <Typography component="h2">Follow Us</Typography>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer">
              <Twitter className="twitterSvgIcon" />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
