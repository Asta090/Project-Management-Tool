import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Home.css";
import moonIcon from "/icons8-moon-and-stars-64.png";
import aboutIcon from "/icons8-about-64.png";

const Home: React.FC = () => {
  const [gradientClass, setGradientClass] = useState("gradient-light");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false); 
  const navigate = useNavigate(); 
  const cycleBackground = () => {
    setGradientClass((prev) =>
      prev === "gradient-light" ? "gradient-medium" :
      prev === "gradient-medium" ? "gradient-dark" :
      "gradient-light"
    );
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

 
  const goToSignup = () => {
    navigate("/signup"); 
  };

  return (
    <div className={`home-container ${gradientClass}`}>
      <div className="center-content">
        <h1 className="h1">Welcome to the TeaM</h1>
        <h2 className="h2">
          One platform to streamline all workflows
        </h2>
      </div>

     
      <div 
        className="floating-icon-button" 
        onClick={cycleBackground}
        onMouseEnter={() => setShowTooltip(true)}  
        onMouseLeave={() => setShowTooltip(false)} 
      >
        <img src={moonIcon} alt="Moon Icon" className="moon-icon" />
        {showTooltip && <span className="tooltip">Modes</span>}
      </div>

     
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>About the App</h3>
            <p>
              This app is designed to streamline all your workflows in one platform. 
              It provides tools and features to help you manage tasks, collaborate with 
              your team, and increase productivity.
            </p>
            <button className="get-started-button" onClick={goToSignup}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
