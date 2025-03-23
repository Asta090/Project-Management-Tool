const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const usersModel = require("./models/users");
const tasksRouter = require("./tasks");
const router = require("./boards");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "asdfgh"; 

mongoose.connect("mongodb://127.0.0.1:27017/signup", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB Connection Error:", err);
});

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await usersModel.findOne({ email: email });

        if (!user) {
            return res.json({ message: "No record existed" });
        }

        if (user.password !== password) {
            return res.json({ message: "The Password is incorrect" });
        }

      
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Success", token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.post("/signup", (req, res) => {
    usersModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err));
});


const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request object
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};


app.use("/", authenticateToken, tasksRouter);
app.use("/api", authenticateToken, router);

app.listen(3001, () => {
    console.log("Server is running");
});
