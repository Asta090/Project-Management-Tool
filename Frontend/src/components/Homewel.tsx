import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import "./Homewel.css";

const Home = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-container">
     
      <div className="video-container">
      <video autoPlay loop muted>
  <source src="/background4.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
      </div>

      
      <div className="overlay"></div>

     
      <h1 className="team-heading">TeaM</h1>
      <button onClick={() => setOpen(true)} className="about-button">
        <img src="/icons8-about-64.png" alt="About Icon" className="about-icon" />
      </button>

      {/* About Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>About</DialogTitle>
        <DialogContent>
          <p>
            This app is designed to streamline all your workflows in one platform.
            It provides tools and features to help you manage tasks, collaborate with
            your team, and increase productivity.
          </p>
          <button onClick={() => navigate("/signup")} className="get-started-button">
            Get Started
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
