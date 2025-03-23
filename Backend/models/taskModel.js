const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    priority: { type: String, enum: ["top", "middle", "low"], required: true },
    deadline: { type: String, required: true },
    done: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;