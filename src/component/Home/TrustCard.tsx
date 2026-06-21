import React from "react";
import { IconType } from "react-icons";
import "./TrustCard.css";

interface TrustCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const TrustCard: React.FC<TrustCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="trust-card">
      <div className="trust-icon-wrapper">
        <Icon className="trust-icon" />
      </div>
      <div className="trust-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default TrustCard;
