const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect } = require("./db");
const router = require("./Routes/index");
const app = express();
const path = require('path');

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
  }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Correct Order
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    
app.get("/", (req, res) => {
    res.send("Hello, This is My Backend");
});

app.use("/api", router);

connect();

app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
