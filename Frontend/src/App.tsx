import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Signup from "./components/Signup"; 
import Homewel from "./components/Homewel"; 
import Login from "./components/Login";
import Board from "./components/Board";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import Calendar from "./components/Calendar";
import Tasks from "./components/Tasks";
import DraggableButton from "./components/DraggableButton"; // Import the DraggableButton

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [incomplete, setIncomplete] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [inReview, setInReview] = useState<Task[]>([]);
  const [backlog, setBacklog] = useState<Task[]>([]);
  const [nextTaskId, setNextTaskId] = useState<number>(1);

  return (
    <div className="app-container" style={{ marginTop: "0px" }}>
      <Router>
        <DndProvider backend={HTML5Backend}>
          <ConditionalNavbar /> {/* Conditionally render Navbar */}
          <ConditionalDraggableButton /> {/* Conditionally render DraggableButton */}
          <div className="app-container">
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="home" element={<Home />} />
              <Route path="signup" element={<Signup />} />
              <Route path="/" element={<Layout />} />
              <Route index element={<Homewel />} />
              <Route
                path="kanban"
                element={
                  <Board
                    incomplete={incomplete}
                    completed={completed}
                    inReview={inReview}
                    backlog={backlog}
                    setIncomplete={setIncomplete}
                    setCompleted={setCompleted}
                    setInReview={setInReview}
                    setBacklog={setBacklog}
                    nextTaskId={nextTaskId}
                    setNextTaskId={setNextTaskId}
                  />
                }
              />
              <Route
                path="dashboard"
                element={
                  <Dashboard
                    incomplete={incomplete}
                    completed={completed}
                    inReview={inReview}
                    backlog={backlog}
                  />
                }
              />
              <Route path="calendar" element={<Calendar />} />
              <Route path="tasks" element={<Tasks />} />
            </Routes>
          </div>
        </DndProvider>
      </Router>
    </div>
  );
};

// Component to conditionally render the Navbar
const ConditionalNavbar: React.FC = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login", "/signup"]; // Routes where Navbar should be hidden

  return hideNavbarRoutes.includes(location.pathname) ? null : <Navbar />;
};

// Component to conditionally render the DraggableButton
const ConditionalDraggableButton: React.FC = () => {
  const location = useLocation();
  const hideDraggableButtonRoutes = ["/", "/login", "/signup"]; // Hide on Homewel, Login, and Signup

  return hideDraggableButtonRoutes.includes(location.pathname) ? null : <DraggableButton />;
};

export default App;
