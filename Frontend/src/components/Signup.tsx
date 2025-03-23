import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post('http://localhost:3001/signup', { name, email, password })
      .then(result => {
        console.log(result);
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="home-container">
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
  <source src="/background6.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

      {/* Modal Content */}
      <div className="content">
        <h2>Sign Up</h2>
        <form className="signup-form"   onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="get-started-button">
            Sign Up
          </button>

          <Link to="/login" className="login-link">
            Already have an account? <span>Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;