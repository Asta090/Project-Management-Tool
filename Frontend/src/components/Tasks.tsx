import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Tasks.css";
import { useNavigate } from "react-router-dom";

type Task = {
    _id: string;
    task: string;
    priority: string;
    deadline: string;
    done: boolean;
};

function Table() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("top");
    const [deadline, setDeadline] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in. Redirecting to login page...");
            navigate("/login");
            return;
        }

        console.log("Fetching tasks with token:", token); // Debugging

        axios.get("http://localhost:3001/tasks", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            console.log("Tasks fetched successfully:", res.data); // Debugging
            const allTasks = res.data;
            setTasks(allTasks.filter((t: Task) => !t.done));
            setCompletedTasks(allTasks.filter((t: Task) => t.done));
        })
        .catch((err) => {
            console.error("Error fetching tasks:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        });
    }, [navigate]);

    const addTask = () => {
        if (task.trim() === "" || deadline === "") {
            alert("Please enter a task and select a valid deadline.");
            return;
        }

        const selectedDate = new Date(deadline);
        const currentDate = new Date();
        if (selectedDate <= currentDate) {
            alert("Please select a future date for the deadline.");
            return;
        }

        const newTask = { task, priority, deadline, done: false };
        const token = localStorage.getItem("token");

        axios.post("http://localhost:3001/add-task", newTask, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            console.log("Task added:", res.data); // Debugging
            setTasks([...tasks, res.data]);
            setTask(""); setPriority("top"); setDeadline("");
        })
        .catch((err) => {
            console.error("Error adding task:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        });
    };

    const markDone = (id: string) => {
        const token = localStorage.getItem("token");

        axios.put(`http://localhost:3001/mark-done/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            console.log("Task marked as done:", res.data); // Debugging
            setTasks(tasks.filter((t) => t._id !== id));
            setCompletedTasks([...completedTasks, res.data]);
        })
        .catch((err) => {
            console.error("Error marking task done:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        });
    };

    const removeCompletedTask = (id: string) => {
        const token = localStorage.getItem("token");

        axios.delete(`http://localhost:3001/delete-task/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            console.log("Task removed:", id); // Debugging
            setCompletedTasks(completedTasks.filter((t) => t._id !== id));
        })
        .catch((err) => {
            console.error("Error deleting task:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        });
    };

    return (
      <div className="table-page">
        <div className="full-page-background">
          <div className="content-container">
            <div className="table-container">
              <div className="App">
                <header>
                    <h1>Task Scheduler</h1>
                </header>
                <main>
                    <div className="task-form">
                        <input type="text" placeholder="Enter task..." value={task} onChange={(e) => setTask(e.target.value)} />
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="top">Top Priority</option>
                            <option value="middle">Middle Priority</option>
                            <option value="low">Less Priority</option>
                        </select>
                        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                        <button onClick={addTask}>Add Task</button>
                    </div>
                    
                    <h2 className="heading">Upcoming Tasks</h2>
                    <div className="task-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task Name</th>
                                    <th>Priority</th>
                                    <th>Deadline</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((t) => (
                                    <tr key={t._id}>
                                        <td>{t.task}</td>
                                        <td>{t.priority}</td>
                                        <td>{t.deadline}</td>
                                        <td>
                                            {!t.done && (
                                                <button className="mark-done" onClick={() => markDone(t._id)}>
                                                    Mark Done
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <h2 className="cheading">Completed Tasks</h2>
                    <div className="completed-task-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task Name</th>
                                    <th>Priority</th>
                                    <th>Deadline</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedTasks.map((ct) => (
                                    <tr key={ct._id}>
                                        <td>{ct.task}</td>
                                        <td>{ct.priority}</td>
                                        <td>{ct.deadline}</td>
                                        <td>
                                            <button className="remove-task" onClick={() => removeCompletedTask(ct._id)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Table;
