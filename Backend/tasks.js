const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Import JWT for token verification

const router = express.Router();

// Task Schema
const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    priority: { type: String, required: true },
    deadline: { type: String, required: true },
    done: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link tasks to users
});

const Task = mongoose.model("Task", taskSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, "asdfgh"); // Replace with your secret key
        req.user = decoded; // Attach the decoded user information to the request object
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

// Add Task (Protected route)
router.post("/add-task", authenticateToken, async (req, res) => {
    try {
        const { task, priority, deadline } = req.body;
        if (!task || !priority || !deadline) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTask = new Task({
            task,
            priority,
            deadline,
            done: false,
            user: req.user.userId, // Link task to the logged-in user
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error adding task", error });
    }
});

// Get All Tasks for the Logged-in User (Protected route)
router.get("/tasks", authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.userId }); // Fetch tasks for the logged-in user
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
});

// Mark Task as Done (Protected route)
router.put("/mark-done/:id", authenticateToken, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId }, // Ensure the task belongs to the logged-in user
            { done: true },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
});

// Delete Task (Protected route)
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId, // Ensure the task belongs to the logged-in user
        });

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
});

module.exports = router;