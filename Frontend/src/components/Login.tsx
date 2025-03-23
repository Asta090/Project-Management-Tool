import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // Reusing the same CSS for styling
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Details:", { email, password });

    try {
      const result = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      console.log(result);

      if (result.data.message === "Success") {
        // Store the JWT token in localStorage or sessionStorage
        localStorage.setItem("token", result.data.token);

        // Redirect to the home page
        navigate("/home");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background7.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>

        <Link to="/signup" className="login-link">
          Don't have an account? <span>Sign Up</span>
        </Link>
      </form>
    </div>
  );
};

export default Login;