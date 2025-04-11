import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/general.css";

const NavigationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="nav-buttons">
      <button onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
};

export default NavigationButtons;
